import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ComunicationService } from '../../services/comunication.service';
import { AutocompleteComponent } from '../../shared/autocomplete/autocomplete.component';
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
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-become-to-pro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    RouterLink,
    HeaderComponent,
    SidebarComponent,
    AutocompleteComponent,
    ModalComponent,
    NgxMaskDirective
  ],
  templateUrl: './become-to-pro.component.html',
  styleUrl: './become-to-pro.component.css'
})
export default class BecomeToProComponent implements OnInit {
  @ViewChild('modal') modal!: ModalComponent;
  //@ViewChild('contentTemplate') contentTemplate!: TemplateRef<any>;



  value: boolean = false;
  licenses: boolean = false;
  selectedFile: File | null = null;

  listCategories: Array<Category> = [];
  listServicesPro: Array<any> = [];
  listZipcode: Array<Zipcode> = [];
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  token: string = '';
  proPersonalForm: FormGroup;
  proBusinessForm: FormGroup;
  currentStep: number = 1;
  isSelectOption: string = ''
  showOptsPro: boolean = true;
  onSelect: boolean = false;
  profileForm!: FormGroup;
  previewImg: string | ArrayBuffer | null = null;
  imageBusiness: string = '';
  isUserProPersonal: boolean = false;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
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


    private categoryService: CategoryService,
    private zipCodeService: ZipcodeService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.proPersonalForm = this.fb.group({
      categories: new FormControl([], [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required, Validators.minLength(10)]),
      //imagePersonal: new FormControl('', [Validators.required]),
      introduction: new FormControl([''])
    });
    this.proBusinessForm = this.fb.group({
      nameBusiness: new FormControl('', [Validators.required]),
      yearFounded: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      numberOfemployees: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      imageBusiness: new FormControl('')
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

        if (response.user.profile != null) {
          //The user is already a professional
          this.isUserProPersonal = true;
          this.user.profile = response.user.profile!;

          const categoryIds = response.user.profile?.categories?.map((category: any) => category.id) || [];

          this.proPersonalForm.patchValue({
            id: this.user.profile.id,
            categories: categoryIds || [],
            zipcode: this.user.profile.zipcodeId,
            address: this.user.profile.address,
            //imagePersonal: this.user.profile.imagePersonal,
            introduction: this.user.profile.introduction
          });
          if (this.user.profile.isBusiness) {
            //the professional is business
            this.isUserProPersonal = false;
            this.showOptsPro = false
            this.imageBusiness = this.user.profile.imageBusiness || '';
            this.proBusinessForm.patchValue({

              nameBusiness: this.user.profile.nameBusiness,
              yearFounded: this.user.profile.yearFounded,
              numberOfemployees: this.user.profile.numberOfemployees,
              //imagePersonal: this.user.profile.imagePersonal,
              //introduction: this.user.profile.introduction
            });
          }
        } else {

          //If it is the first time you create the profile
          //We hide the business form so that it can be selected by the user
          this.isUserProPersonal = true;
          this.openModalOnPageLoad();

        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
  openModalOnPageLoad() {
    if (this.modal) {

      this.modal.open();
    }
  }


  onRadioChange(event: Event) {

    this.onSelect = true;
    const target = event.target as HTMLInputElement;

    this.isSelectOption = target.value;
    //Evaluamos el radio
    if (this.isSelectOption === 'isBusiness') {
      this.isUserProPersonal = false;
    }
    else {
      this.isUserProPersonal = true;
      this.currentStep = 1;
    }
  }

  handleConfirm() {
    if (this.isSelectOption === 'isBusiness') {
      //this.showBusiness = true;
    }
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.previewImg = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

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
  goStep() {
    if (this.currentStep == 1) {
      this.currentStep++;
    }
  }
  onSubmit() {
   


    if (this.proPersonalForm.valid) {
      this.isLoading = true;
      const formData = this.proPersonalForm.value;
      const profile: Profile = {

        categories: formData.categories || [],
        zipcodeId: formData.zipcode || '',
        address: formData.address || '',
        //imagePersonal: formData.imagePersonal || '',
        introduction: formData.introduction || '',
        isBusiness: false
      };

      if (!this.user.profile || !this.user.profile.id) {

        this.userService.becomeToPro(profile).subscribe({
          next: (response) => {

            this.alertMessage = 'alert-success'
            this.backendMessage = response.message;
            this.isLoading = false;
            this.authService.updateUserName('available', `${response.user.profile.available}` );   
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
  onSubmitBusiness() {
    
    if (this.proBusinessForm.valid) {
      this.isLoading = true;

      const formDataP = this.proPersonalForm.value;
      const formDataB = this.proBusinessForm.value;

      const user: User = {
        id: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        profile: {

          categories: formDataP.categories || [],
          zipcodeId: formDataP.zipcode || '',
          address: formDataP.address || '',
          imagePersonal: formDataP.imagePersonal || '',
          introduction: formDataP.introduction || '',
          isBusiness: true,
          nameBusiness: formDataB.nameBusiness || '',
          yearFounded: formDataB.yearFounded || '',
          numberOfemployees: formDataB.numberOfemployees || '',
          imageBusiness: formDataB.imageBusiness || '',

        }
      };

      this.userService.putMe(user).subscribe({
        next: (response) => {
          
          this.alertMessage = 'alert-success'
          this.backendMessage = 'Profile updated success';
          this.isLoading = false;
          this.startAlertTimer();
          if (this.selectedFile) {
            this.isLoading = true;
            const formData = new FormData();
            formData.append('file', this.selectedFile);

         

            this.userService.postUploads(formData, 'business').subscribe({
              next: (response) => {
                console.log(response)

              },
              error: (error) => {
                this.alertMessage = 'alert-danger'
                this.backendMessage = error.error.message;
                this.isLoading = false;
                this.startAlertTimer();
              }
            });


          } /*else {
            alert('Por favor selecciona una imagen.');
          }*/
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





  startAlertTimer() {
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.backendMessage = '';
    }, 3000);
  }

}


