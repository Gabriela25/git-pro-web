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
import { UploadsService } from '../../services/uploads.service';

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
  imagePersonal: string = '';
  imageBusiness: string = '';
  isUserProPersonal: boolean = false;
  @ViewChild('fileInputPersonal') fileInputPersonal!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputBusiness') fileInputBusiness!: ElementRef<HTMLInputElement>;
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
    private authService: AuthService,
    private uploadsService: UploadsService
  ) {
    this.proPersonalForm = this.initializeProPersonalForm();
    this.proBusinessForm = this.initializeProBusinessForm();
   
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.checkUserProfile();
    
  }
  initializeProPersonalForm(): FormGroup {
    return this.fb.group({
      categories: new FormControl([], [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required, Validators.minLength(10)]),
      imagePersonal: new FormControl(''),
      introduction: new FormControl('')
    });
  }

  initializeProBusinessForm(): FormGroup {
    return this.fb.group({
      nameBusiness: new FormControl('', [Validators.required]),
      yearFounded: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      numberOfemployees: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
      imageBusiness: new FormControl('')
    });
  }
  loadInitialData() {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => this.listCategories = response.categories,
      error: (error) => console.error(error)
    });
    this.zipCodeService.getAllZipcodes().subscribe({
      next: (response) => this.listZipcode = response.zipcodes,
      error: (error) => console.error(error)
    });
    
  }
  initializeUser(): User {
    return {
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
    };
  }
  checkUserProfile() {
    this.userService.getMe().subscribe({
      next: (response) => this.populateUserProfile(response.user),
      error: (error) => console.error(error)
    });
  }
  populateUserProfile(user: User) {
    if (user.profile) {
      this.isUserProPersonal = !user.profile.isBusiness;
      this.user = user;
      this.imagePersonal = user.profile.imagePersonal || '';
      this.imageBusiness = user.profile.imageBusiness || '';
      this.proPersonalForm.patchValue({
        categories: user.profile.categories.map((category: any) => category.id),
        zipcode: user.profile.zipcodeId,
        address: user.profile.address,
        introduction: user.profile.introduction
      });
      if (user.profile.isBusiness) {
        this.proBusinessForm.patchValue({
          nameBusiness: user.profile.nameBusiness,
          yearFounded: user.profile.yearFounded,
          numberOfemployees: user.profile.numberOfemployees
        });
      }
    } else {
      this.openModalOnPageLoad();
    }
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
  triggerFileInputP(): void {
    this.fileInputPersonal.nativeElement.click();
  }
  triggerFileInputB(): void {
    this.fileInputBusiness.nativeElement.click();
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
  
  /*onSubmit() {
   


    if (this.proPersonalForm.valid) {
      this.isLoading = true;
      const formData = this.proPersonalForm.value;
      const profile: Profile = {

        categories: formData.categories || [],
        zipcodeId: formData.zipcode || '',
        address: formData.address || '',
        imagePersonal: formData.imagePersonal || '',
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
            if (this.selectedFile) {
              this.isLoading = true;
              const formData = new FormData();
              formData.append('model', 'profile');
              formData.append('idModel','');
              formData.append('field', 'imageBusiness');
              formData.append('file', this.selectedFile);
  
           
  
              this.uploadsService.postUploads(formData).subscribe({
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
            }

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
  }*/
    onSubmit(isBusiness: boolean) {
      if (isBusiness) {
        this.submitProfile(this.proBusinessForm, isBusiness);
      } else {
        
        this.submitProfile(this.proPersonalForm, isBusiness);
      }
    }
  
    submitProfile(formGroup: FormGroup, isBusiness: boolean) {
      
      if (formGroup.valid) {
        this.isLoading = true;
        const formData = formGroup.value;
        const profile: Profile = {
          categories: formData.categories || [],
          zipcodeId: formData.zipcode || '',
          address: formData.address || '',
          imagePersonal: formData.imagePersonal || '',
          introduction: formData.introduction || '',
          isBusiness
        };
  
        if (!this.user.profile || !this.user.profile.id) {

          
          this.userService.becomeToPro(profile).subscribe({
            next: (response) => {
              this.handleSuccessfulSubmission(response);
              if (this.selectedFile) {
                this.uploadImage(this.selectedFile, isBusiness);
              }
            },
            error: (error) => this.handleError(error)
          });
        }
        else{
          if(!isBusiness){
            this.userService.putMe({ ...this.user, profile }).subscribe({
              next: (response) => {
                this.handleSuccessfulSubmission(response);
                if (this.selectedFile) {
                  this.uploadImage(this.selectedFile, isBusiness);
                }
              },
              error: (error) => this.handleError(error)
            });
          }
          else{
            const profile: Profile = {
              categories: this.proPersonalForm.value.categories || [],
              zipcodeId: this.proPersonalForm.value.zipcodeId || '',
              address:this.proPersonalForm.value.address|| '',
              imagePersonal: this.proPersonalForm.value.imagePersonal || '',
              introduction:this.proPersonalForm.value.introduction || '',
              isBusiness: true,
              nameBusiness: formData.nameBusiness || '',
              yearFounded: formData.yearFounded || '',
              numberOfemployees: formData.numberOfemployees || '',
              imageBusiness: formData.imageBusiness || '',
    
            };
              this.userService.putMe({ ...this.user, profile }).subscribe({
              next: (response) => {
                this.handleSuccessfulSubmission(response);
                if (this.selectedFile) {
                  this.uploadImage(this.selectedFile, isBusiness);
                }
              },
              error: (error) => this.handleError(error)
            });
          }
         
         
        }
      }
    }
    handleSuccessfulSubmission(response: any) {
      this.alertMessage = 'alert-success';
      this.backendMessage = response.message || 'Profile updated successfully';
      this.isLoading = false;
      this.startAlertTimer();
    }
  
    handleError(error: any) {
      this.alertMessage = 'alert-danger';
      this.backendMessage = error.error.message || 'An error occurred';
      this.isLoading = false;
      this.startAlertTimer();
    }
    uploadImage(file: File, isBusiness: boolean) {
      const formData = new FormData();
      formData.append('model', 'profile');
      formData.append('idModel', '');
      formData.append('field', isBusiness ? 'imageBusiness' : 'imagePersonal');
      formData.append('file', file);
      
      this.uploadsService.postUploads(formData).subscribe({
        next: (response) => console.log('Image uploaded successfully', response),
        error: (error) => this.handleError(error)
      });
    }
  
    startAlertTimer() {
      if (this.alertTimeout) {
        clearTimeout(this.alertTimeout);
      }
      this.alertTimeout = setTimeout(() => {
        this.backendMessage = '';
      }, 3000);
    }
  /*onSubmitBusiness() {
    
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
            formData.append('model', 'profile');
            formData.append('idModel','');
            formData.append('field', 'imageBusiness');
            formData.append('file', this.selectedFile);

         

            this.uploadsService.postUploads(formData).subscribe({
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
          }
        },
        error: (error) => {
          this.alertMessage = 'alert-danger'
          this.backendMessage = error.error.message;
          this.isLoading = false;
          this.startAlertTimer();
        }
      });

    }
  }*/





  
}


