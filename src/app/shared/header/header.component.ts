
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
import { environment } from '../../../environments/environment.development';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { Category } from '../../interface/category.interface';
import { CategoryService } from '../../services/category.service';
import { LeadService } from '../../services/lead.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    NgMultiSelectDropDownModule
    //NotificationComponent
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
  urlUploads: string = environment.urlUploads
  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('profilePicModal') profilePicModal!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('closebutton') closeButton!: ElementRef;

  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  listCategories: Array<Category> = [];
  constructor(
    private trans: TranslateService,
    private router: Router,
    private userService: UserService,
    private categoryService: CategoryService,
    private authService : AuthService,
    private leadService: LeadService
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
          this.imagePersonal = `${this.urlUploads}${data.imagePersonal}`; 
        }
        this.isOnline = data.available; 
        this.isPro = data.isPro || false; 
        if(this.isPro){
          this.textPro  = 'Professional info';
       
        }
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
    console.log('entre',item)
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
  /*openModal() {
    this.modal.open();
  }*/
  signOut() {
    this.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.authService.authStatus = authStatus.notAuthenticated;
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

}
