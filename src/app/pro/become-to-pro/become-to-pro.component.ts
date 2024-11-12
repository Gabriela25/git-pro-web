
import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { SocketComponent } from "../../shared/socket/socket.component";
import { CapitalizeFirstDirective } from '../../shared/directives/capitalize-first.directive';
import { NoWhitespaceDirective } from '../../shared/directives/no-whitespace';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-become-to-pro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    HeaderComponent,
    ModalComponent,
    CapitalizeFirstDirective,
    
    NoWhitespaceDirective,
    NgMultiSelectDropDownModule
  
    
  ],
  templateUrl: './become-to-pro.component.html',
  styleUrl: './become-to-pro.component.css'
})
export default class BecomeToProComponent implements OnInit {
  @ViewChild('modal') modal!: ModalComponent;

  value: boolean = false;
  licenses: boolean = false;
  selectedFilePersonal: File | null = null;

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
  isSelectOption: string = '';
  showOptsPro: boolean = true;
  showBusinessTab: boolean = false;
  onSelect: boolean = false;
  profileForm!: FormGroup;

  imagePersonal: string = '';
  imageBusiness: string = '';
  isUserProPersonal: boolean = false;
  previewImgPersonal: string | ArrayBuffer | null = null;
  previewImgBusiness: string | ArrayBuffer | null = null;
  isBusiness: boolean = false;
  previewImg: string | ArrayBuffer | null = null;
  @ViewChild('fileInputPersonal') fileInputPersonal!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputBusiness') fileInputBusiness!: ElementRef<HTMLInputElement>;
  selectedFileBusiness: File | null = null;
  base64Image: string | null = null;
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
  dropdownList :any = [];
  selectedItems:any= [];
  dropdownSettings:any = {};
  
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private zipCodeService: ZipcodeService,
    private userService: UserService,
    private uploadsService: UploadsService,
    private authService: AuthService
  ) {
    this.proPersonalForm = this.initializeProPersonalForm();
    this.proBusinessForm = this.initializeProBusinessForm();

  }
  ngOnInit(): void {
    this.loadInitialData();
    this.checkUserProfile();
  
      
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'id',
        textField: 'name',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 4,
        allowSearchFilter: true
      };
     
   
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  initializeProPersonalForm(): FormGroup {
    return this.fb.group({
      categories: new FormControl([], [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required, Validators.minLength(10)]),
      imagePersonal: new FormControl('', [Validators.required]),
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
  validateNumber(event: KeyboardEvent): void {
    const charCode = event.keyCode ? event.keyCode : event.which;
    if ((charCode < 48 || charCode > 57) && charCode !== 8 && charCode !== 9) {
      event.preventDefault();
    }
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
      next: (response) => {
        this.populateUserProfile(response.user)
      },
      error: (error) => console.error(error)
    });
  }
  populateUserProfile(user: User) {

    if (user.profile) {
      //asignamos si el perfil es personal o business
      this.isUserProPersonal = !user.profile.isBusiness;
      this.user = user;
      this.imagePersonal = user.profile.imagePersonal || 'assets/avatar_profile.png';
      
       
      
      this.proPersonalForm.patchValue({
        categories: user.profile.categories,
        zipcode: user.profile.zipcodeId,
        address: user.profile.address,
        imagePersonal: user.profile.imagePersonal,
        introduction: user.profile.introduction
      });
      if (user.profile.isBusiness) {
        this.isBusiness = true;
        this.imageBusiness = user.profile.imageBusiness || 'assets/avatar_profile.png';
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
    if (this.isSelectOption === 'isBusiness') {
      this.isUserProPersonal = false;
      this.showBusinessTab = this.isSelectOption === 'isBusiness';
    }
    else {
      this.isUserProPersonal = true;
      //this.currentStep = 1;
    }
  }
  onAccept() {
    console.log('clieck del boton')

    console.log(this.showBusinessTab)
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const base64String = reader.result as string;
          //base64 para vista previa de la imagen
          if (input.id == 'imagePersonal') {
            this.previewImgPersonal = e.target.result;
            //se setea el base64, para el campo del formulario
            this.proPersonalForm.get('imagePersonal')?.setValue(base64String);
            this.selectedFilePersonal = file;
          }
          else {
            this.previewImgBusiness = e.target.result;
            //se setea el base64, para el campo del formulario
            this.proBusinessForm.get('imageBusiness')?.setValue(base64String);
            this.selectedFileBusiness = file;
          }

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
  nextStep() {
    this.validatedFormPersonal()
  }
  validatedFormPersonal() {
    this.proPersonalForm.markAllAsTouched();
    if (this.currentStep == 1) {
      if (this.proPersonalForm.invalid) {
        return;
      }
      this.currentStep++;
    }
  }
  goToStep(step: number) {
    if (step == 2) {
      this.validatedFormPersonal()
    }
    else if (step == 1) {
      this.currentStep = step;
    }
  }

  onSubmit() {
    if (this.proPersonalForm.valid) {
      console.log(this.proPersonalForm.value.categories)
      const formData = this.proPersonalForm.value;
      const profile: Profile = {
        categories: this.proPersonalForm.value.categories.map((category: any) => category.id),
        zipcodeId: formData.zipcode || '',
        address: formData.address || '',
        imagePersonal: formData.imagePersonal || '',
        introduction: formData.introduction || '',
        isBusiness: false,
        available: true
      };
      if (!this.user.profile || !this.user.profile.id) {

        const isBusiness = false;
        this.userService.becomeToPro(profile).subscribe({
          next: (response) => {
            this.user.profile = response.profile
            this.handleSuccessfulSubmission(response);
            this.authService.updateUser('available', true);
            this.authService.updateUser('isPro', true);
            if (this.selectedFilePersonal) {
              this.uploadImage(this.selectedFilePersonal, isBusiness);
            }
          },
          error: (error) => this.handleError(error)
        });
      }
      else if (this.user.profile?.isBusiness == false && !this.proBusinessForm.valid) {

        this.userService.putMe({ ...this.user, profile }).subscribe({
          next: (response) => {
            this.authService.updateUser('available', response.user.profile?.available);
            this.handleSuccessfulSubmission(response);
            if (this.selectedFilePersonal) {
              this.uploadImage(this.selectedFilePersonal, false);
            }
          },
          error: (error) => this.handleError(error)
        });

      } else if (this.proBusinessForm.valid) {
        const profile: Profile = {
          categories: this.proPersonalForm.value.categories.map((category: any) => category.id),
          zipcodeId: this.proPersonalForm.value.zipcode || '',
          address: this.proPersonalForm.value.address || '',
          imagePersonal: this.proPersonalForm.value.imagePersonal || '',
          introduction: this.proPersonalForm.value.introduction || '',
          isBusiness: true,
          nameBusiness: this.proBusinessForm.value.nameBusiness || '',
          yearFounded: this.proBusinessForm.value.yearFounded || '',
          numberOfemployees: this.proBusinessForm.value.numberOfemployees || '',
          //imageBusiness:this.proBusinessForm.value.imageBusiness || '',
          available: true
        };
        this.userService.putMe({ ...this.user, profile }).subscribe({
          next: (response) => {
            this.handleSuccessfulSubmission(response);
            if (this.selectedFilePersonal != null) {
              this.uploadImage(this.selectedFilePersonal, false);
            }
            if (this.selectedFileBusiness != null) {
              this.uploadImage(this.selectedFileBusiness, true);
            }
           
          },
          error: (error) => this.handleError(error)
        });
      }

    }
    /*if (isBusiness) {
      this.submitProfile(this.proBusinessForm, isBusiness);
    } else {
      this.submitProfile(this.proPersonalForm, isBusiness);
    }*/
    
  }

  /*submitProfile(formGroup: FormGroup, isBusiness: boolean) {
    formGroup.markAllAsTouched();
    if (formGroup.invalid) {
      return;
    } else {
      if (formGroup.valid) {
        this.isLoading = true;
        const formData = formGroup.value;
        const profile: Profile = {
          categories: formData.categories || [],
          zipcodeId: formData.zipcode || '',
          address: formData.address || '',
          imagePersonal: formData.imagePersonal || '',
          introduction: formData.introduction || '',
          isBusiness: false,
          available: true
        };

        if (!this.user.profile || !this.user.profile.id) {
          this.userService.becomeToPro(profile).subscribe({
            next: (response) => {
              this.user.profile = response.profile

              this.handleSuccessfulSubmission(response);
              this.authService.updateUser('available', true);
              this.authService.updateUser('isPro', true);
              /*if (this.selectedFile) {
                this.uploadImage(this.selectedFile, isBusiness);
              }
            },
            error: (error) => this.handleError(error)
          });
        }
        else {
          if (!isBusiness) {
            this.userService.putMe({ ...this.user, profile }).subscribe({
              next: (response) => {
                this.authService.updateUser('available', response.user.profile?.available);
                this.handleSuccessfulSubmission(response);
                /*if (this.selectedFile) {
                  this.uploadImage(this.selectedFile, isBusiness);
                }
              },
              error: (error) => this.handleError(error)
            });
          }
          else {

            const profile: Profile = {
              categories: this.proPersonalForm.value.categories || [],
              zipcodeId: this.proPersonalForm.value.zipcode || '',
              address: this.proPersonalForm.value.address || '',
              imagePersonal: this.proPersonalForm.value.imagePersonal || '',
              introduction: this.proPersonalForm.value.introduction || '',
              isBusiness: true,
              nameBusiness: formData.nameBusiness || '',
              yearFounded: formData.yearFounded || '',
              numberOfemployees: formData.numberOfemployees || '',
              imageBusiness: formData.imageBusiness || '',
              available: true
            };
            console.log(profile)
            this.userService.putMe({ ...this.user, profile }).subscribe({
              next: (response) => {
                this.handleSuccessfulSubmission(response);

                /*if (this.selectedFile) {
                  this.uploadImage(this.selectedFile, isBusiness);
                }
              },
              error: (error) => this.handleError(error)
            });
          }
        }
      }
    }
  }*/
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
      next: (response) => {
        if (response.uploads.urlImage) {
          if (this.selectedFilePersonal != null) {
            this.authService.updateUser('imagePersonal', response.uploads.urlImage);
            this.selectedFilePersonal = null
          }
        }
      },
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

}


