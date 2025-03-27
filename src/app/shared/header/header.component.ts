
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

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
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    NgMultiSelectDropDownModule,
    ModalComponent
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
  isOnline: boolean = true;
  isPro: boolean = false;
  textPro: string = '';
  title: string = '';
  urlUploads: string = environment.urlUploads
  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('profilePicModal') profilePicModal!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('closebutton') closeButton!: ElementRef;

  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  listCategories: Array<Category> = [];
  bodyModal!: SafeHtml | string;
  constructor(
    private trans: TranslateService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private categoryService: CategoryService,
    private authService : AuthService,
    private leadService: LeadService,
    private serviceWorkersService: ServiceWorkersService
  ) {
    this.trans.addLangs(['es', 'en']);
    this.isAuthenticated = this.authService.isAuthenticated()
    console.log(this.isAuthenticated )
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
          this.imagePersonal = `${this.urlUploads}${data.imagePersonal}`; 
        }
        else {
          this.imagePersonal = "";
        }      
        this.isOnline = data.available; 
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
   
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true,
      closeDropDownOnSelection: true,
      singleSelect: true
    };
    this.categoryService.getAllCategories().subscribe({
      next: (response) => this.listCategories = response.categories,
      error: (error) => console.error(error)
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
    this.isOnline = !this.isOnline;
 
    const user: User = {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      profile: {
        categories: [],
        zipcodeId: '',
        address: '',
        imagePersonal: '',
        introduction: '',
        isBusiness: false,
        available: this.isOnline
      }
    };

    this.userService.putMe(user).subscribe({
      next: (response) => {  
        this.authService.updateUser('available', response.user.profile?.available);
      },
      error: (error) => {
      }
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
    console.log('entre para abrir el modal')
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

}
