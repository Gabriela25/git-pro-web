import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ComunicationService } from '../../services/comunication.service';
import { AutocompleteComponent } from '../../shared/autocomplete/autocomplete.component';
import { LicensesComponent } from './licenses/licenses.component';
import { CategoryService } from '../../services/category.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxMaskDirective } from 'ngx-mask';
import { ZipcodeService } from '../../services/zipcode.service';
import { Category } from '../../interface/category.interface';
import { Zipcode } from '../../interface/zipcode.interface';
import { User } from '../../interface/user.interface';
import { Profile } from '../../interface/profile.interface';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    HeaderComponent,
    SidebarComponent,
    AutocompleteComponent,
    LicensesComponent,
    ModalComponent,
    NgxMaskDirective
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export default class ProfileComponent implements OnInit {
  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('contentTemplate') contentTemplate!: TemplateRef<any>;
  @ViewChild('modalContainer', { static: false }) modalContainer!: ElementRef;
  content: SafeHtml | null = null;

  value: boolean = false;
  licenses: boolean = false;
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null | undefined = null;
  listCategories: Array<Category> = []
  listServicesPro: Array<any> = []
  listZipcode: Array<Zipcode> = []
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  token: string = '';
  proPersonalForm: FormGroup;
  currentStep: number = 1;
  user: User = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    profile: {
      id: '',
      categories: [],
      zipcodeId: '',
      address: '',
      imagePersonal: '',
      introduction: '',

      isBusiness: false
    }
  }

  constructor(
    private fb: FormBuilder,

    private sanitizer: DomSanitizer,
    private renderer: Renderer2,
    private el: ElementRef,
    private categoryService: CategoryService,
    private zipCodeService: ZipcodeService,
    private userService: UserService
  ) {
    this.proPersonalForm = this.fb.group({
      /*firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],*/

      categories: new FormControl([], [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      address:  new FormControl('', [Validators.required,Validators.minLength(10)]),
      imagePersonal: new FormControl('', [Validators.required]),
      introduction:  new FormControl([''])
      //nameBusiness: ['', Validators.required],
      //phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      //yearFounded: ['', Validators.required],
      //numberEmployees: ['', Validators.required],


    });
  }

  ngOnInit(): void {

    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.listCategories = response.categories;

      },
      error: (error) => {
        console.log(error);
      }
    });
    this.zipCodeService.getAllZipcodes().subscribe({
      next: (response) => {
        this.listZipcode = response.zipcodes;

      },
      error: (error) => {
        console.log(error);
      }
    });
    this.userService.getMe().subscribe({
      next: (response) => {
      
        if (this.user.profile != null) {
          this.user.profile = response.user.profile!;

          const categoryIds = response.user.profile?.categories?.map((category: any) => category.id) || [];

          this.proPersonalForm.patchValue({
            id: this.user.profile.id,
            categories: categoryIds || [],
            zipcode: this.user.profile.zipcodeId,
            address: this.user.profile.address,
            imagePersonal: this.user.profile.imagePersonal,
            introduction: this.user.profile.introduction
          });
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  /*nextStep() {
    const formData = this.proPersonalForm.value;
    console.log(formData)
    console.log(this.proPersonalForm.get('category')?.valid )
    console.log(this.proPersonalForm.get('zipCode')?.valid )
    console.log(this.proPersonalForm.get('phone')?.valid )
    this.currentStep++;
    /*if (this.currentStep === 1 && this.proPersonalForm.get('category')?.valid && this.proPersonalForm.get('zipCode')?.valid &&
     this.proPersonalForm.get('phone')?.valid ) {
      this.currentStep++;
    } else if (this.currentStep === 2 &&  this.proPersonalForm.get('address')?.valid) {
      this.currentStep++;
    }
  }*/

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step < this.currentStep || (step === 1 && this.proPersonalForm.get('category')?.valid && this.proPersonalForm.get('zipCode')?.valid &&
      this.proPersonalForm.get('phone')?.valid) ||
      (step === 2 && this.proPersonalForm.get('address')?.valid)) {
      this.currentStep = step;
    }
  }

  onSubmit() {
    this.isLoading = true;
    const formData = this.proPersonalForm.value;
    //this.currentStep++;
    if (this.proPersonalForm.valid) {

      const profile: Profile = {

        categories: formData.categories || [],
        zipcodeId: formData.zipcode || '',
        address: formData.address || '',
        imagePersonal: formData.imagePersonal || '',
        introduction: formData.introduction || '',
        isBusiness: false
      };

      if (!this.user.profile) {
        
        this.userService.becomeToPro(profile).subscribe({
          next: (response) => {
            this.alertMessage = 'alert-success'
            this.backendMessage = response.message;
            this.isLoading = false;
            this.startAlertTimer();

          },
          error: (error) => {
            console.log(error)
            this.alertMessage = 'alert-danger'
            this.backendMessage = error.error.message;
            this.isLoading = false;
            this.startAlertTimer();
          }
        });
      }
      else {

        const user: User = {
          id: '',
          firstname: '',
          lastname: '',
          email: '',
          phone: '',
          profile: {
            categories: formData.categories || [],
            zipcodeId: formData.zipcode || '',
            address: formData.address || '',
            imagePersonal: formData.imagePersonal || '',
            introduction: formData.introduction || '',
            isBusiness: false
          }
        };

        this.userService.putMe(user).subscribe({
          next: (response) => {  
            this.alertMessage = 'alert-success'
            this.backendMessage = 'Profile updated success'; 
            this.isLoading = false; 
            this.startAlertTimer();
          },
          error: (error) => {
            this.alertMessage = 'alert-danger'
            this.backendMessage = error.error.message;
            this.isLoading = false;
            this.startAlertTimer();
          }
        });
      }

    }
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


