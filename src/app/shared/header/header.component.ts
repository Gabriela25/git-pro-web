import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { authStatus } from '../../enum/auth.enum';
import { ModalComponent } from '../modal/modal.component';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { Modal } from 'bootstrap';
import { User } from '../../interface/user.interface';
import { NotificationComponent } from '../notification/notification.component';
import { environment } from '../../../environments/environment';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Category } from '../../interface/category.interface';
import { CategoryService } from '../../services/category.service';
import { LeadService } from '../../services/lead.service';
import { ServiceWorkersService } from '../../services/service-workers.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UserReq } from '../../interface/user-req.interface';
import { profile } from 'console';
import { ProfileReviewCommentService } from '../../services/profile-review-comment.service';
import { ProfileReviewComment } from '../../interface/profile-review-comment.interface';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    NgMultiSelectDropDownModule,
    ModalComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  idSignLog: boolean = false;
  isAuthenticated: boolean = false;
  nameUser: string = '';
  emailUser: string = '';
  imagePersonal: string = '';
  selectedFile: File | null = null;
  previewImg: string | ArrayBuffer | null = null;
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  token: string = '';
  isOpen: boolean = false;
  //isOnline: boolean = true;
  isPro: boolean = false;
  textPro: string = '';
  title: string = '';

  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('profilePicModal') profilePicModal!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('closebutton') closeButton!: ElementRef;

  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  listCategories: Array<Category> = [];
  bodyModal!: SafeHtml | string;
  searchTerm: string = '';
  filteredCategories: Category[] = [];
  profileReviewComments: ProfileReviewComment[] = [];
  constructor(
    private trans: TranslateService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private profileReviewCommentService: ProfileReviewCommentService,
    private categoryService: CategoryService,
    private authService : AuthService,
    private leadService: LeadService,
    private serviceWorkersService: ServiceWorkersService

  ) {
    this.trans.addLangs(['es', 'en']);
    this.isAuthenticated = this.authService.isAuthenticated()

  }
  ngOnInit() {
    this.trans.get('header.becomeToPro').subscribe((res: string) => {
      this.textPro = res;

    });
    this.authService.user$.subscribe((data: any) => {

      if (data) {
        this.nameUser = data.name;
        this.emailUser = data.email; 
        if (data.imagePersonal) {
          this.imagePersonal = `${data.imagePersonal}`; 
        }
        else {
          this.imagePersonal = "";
        }      
        //this.isOnline = data.status; 
        this.isPro = data.isPro || false; 
        if(this.isPro){
          this.textPro  = 'Professional info';       
        }
        else{
          this.textPro  = 'Become to pro';   
        }
        this.cdr.detectChanges();
      }
    });
  
    
    this.categoryService.getAllCategories().subscribe({
      
      next: (response) => this.listCategories = response.categories,
      error: (error) => this.handleError(error)
    });

    this.userService.getMe().subscribe({
      next: (response) => {  
        const user:User = response.user;
        if(user.profile){
          const profileId: string = user.profile.id || '';
          this.profileReviewCommentService.getProfileReviewComment(profileId).subscribe({
            next: (response) => { 
              console.log('Comentarios del perfil:')
              console.log(response)
              if(response.profileReviewComment.length > 0){
                for(let comment of response.profileReviewComment){
                  if(comment.statusProfile === 'NEEDS_CORRECTION')
                  {
                    this.profileReviewComments.push(comment);
                  }
                }
              }
            },
            error: (error) => this.handleError(error)
          });   
        }
      },
      error: (error) => this.handleError(error)
    });
  }

  onItemSelect(item: any) {
    if(this.authService.isAuthenticated()){
      this.router.navigate(['/leads/multi']);
      this.leadService.updateDataLead('categoryId',item.id);
      this.leadService.updateDataLead('categoryName',item.name );
    }
    else{
      this.router.navigate(['/auth/login']);     
    }
  }
 

  toggleOnlineStatus(): void {
    //this.isOnline = !this.isOnline;
 
    const user: UserReq = {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      profile: {
        categoryIds: [],
        zipcodeIds: [],
        address: '',
        imagePersonal: '',
        introduction: '',
        isBusiness: false,
        //status: this.isOnline
      }
    };

    this.userService.updateMe(user).subscribe({
      next: (response) => {  
        this.authService.updateUser('status', response.user.profile?.status);
      },
      error: (error) => this.handleError(error)
    });
  }
  switchLanguage(languaje: string) {
    this.trans.use(languaje);
  }
  signOut(event: Event) {
    event.preventDefault();
    this.modalLogOut();
  }
  
  close() {

    this.closeButton.nativeElement.click();
  }
  startAlertTimer() {
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.backendMessage = '';
    }, 3000);
  }
  modalLogOut() {
    
    this.bodyModal = this.sanitizer.bypassSecurityTrustHtml(`
      <div>
        <div class="text-center"></div>
        <h5 class="p-3 text-center">Are you sure you want to log out?</h5>
      </div>
    `);
    this.openModal();
  }
  closeModal() {
    this.modal.close();
  }
  ngAfterViewInit() {
    if (!this.modal) {
      console.error('ModalComponent is not initialized');
    }
  }

  openModal() {
    if (this.modal) {
      this.modal.open();
    } else {
      console.error('Modal is undefined');
    }
  }
  
  acceptLogOut(){
    this.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.authStatus = authStatus.notAuthenticated
    this.router.navigate(['/']);
  }
  
  handleError(error: any) {
    this.isLoading = false;
    this.backendMessage = '';
    setTimeout(() => {
      this.alertMessage = 'alert-danger';
      this.backendMessage = error.error.message || 'An error occurred';
    });

  }
  onSearch(searchTerm: string) {
    console.log('Search term:', searchTerm);
  }
  searchCategory(term: string, event?: Event) {
    if (event) {
      event.preventDefault(); // Evita el refresco de la página
    }
    const found = this.listCategories.find(
      (cat: Category) => cat.name.toLowerCase() === term.trim().toLowerCase()
    );
    if (found) {
      this.navigateToServices(found);
    } else {
      // Opcional: mostrar mensaje de no encontrado
    }
  }

  navigateToServices(item: Category) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/client/multi']);
      this.leadService.updateDataLead('categoryId', item.id);
      this.leadService.updateDataLead('categoryName', item.name);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  onSearchInputChange() {
    const term = this.searchTerm.trim().toLowerCase();
    if (term.length === 0) {
      this.filteredCategories = [];
      return;
    }
    this.filteredCategories = this.listCategories.filter(cat =>
      cat.name.toLowerCase().includes(term)
    );
  }

  onCategorySelect(cat: Category) {
    this.searchTerm = cat.name;
    this.filteredCategories = [];
    this.navigateToServices(cat);
  }
}
