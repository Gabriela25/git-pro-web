
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
import { environment } from '../../../environments/environment';
import { Image } from '../../interface/image.interface';
import { limit } from 'firebase/firestore';
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
  isSelectOption: string = 'isPersonal';
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
  isNext: boolean = false;
  isDisabled: boolean = false;
  previewImg: string | ArrayBuffer | null = null;
  @ViewChild('fileInputPersonal') fileInputPersonal!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputBusiness') fileInputBusiness!: ElementRef<HTMLInputElement>;
  selectedFileBusiness: File | null = null;
  base64Image: string | null = null;
  filesLicences: any
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
  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  urlUploads = environment.urlUploads;
  listImages: Array<Image> =[]
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
      allowSearchFilter: true,
      limitSelection:3
    };


  }
  onItemSelect(item: any) {

  }
  onSelectAll(items: any) {

  }
  initializeProPersonalForm(): FormGroup {
    return this.fb.group({
      categories: new FormControl([], [Validators.required]),
      licenses: new FormControl(null,),
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
      imageBusiness: new FormControl('', [Validators.required]),
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
      this.imagePersonal = `${this.urlUploads}${user.profile.imagePersonal}`;

      this.proPersonalForm.patchValue({
        categories: user.profile.categories,
        zipcode: user.profile.zipcodeId,
        address: user.profile.address,
        imagePersonal: `${this.urlUploads}${user.profile.imagePersonal}`,
        introduction: user.profile.introduction
      });
      if (user.profile.isBusiness) {
        this.isSelectOption = 'isBusiness';
        this.isDisabled = true;

        this.imageBusiness = `${this.urlUploads}${user.profile.imageBusiness}`;
        this.proBusinessForm.patchValue({
          nameBusiness: user.profile.nameBusiness,
          yearFounded: user.profile.yearFounded,
          numberOfemployees: user.profile.numberOfemployees
        });
      }
      this.checkLicences(user.profile.id!)
    } else {
      this.openModalOnPageLoad();
    }
  }
  openModalOnPageLoad() {
    if (this.modal) {
      this.modal.open();
    }
  }
  checkLicences(profileId:string){
    this.userService.getLicense(profileId).subscribe({
      next: (response) => {
       
        this.listImages = response.images
      },
      error: (error) => console.error(error)
    });
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
  onFileChange(event: any): void {
    const files = event.target.files;
    this.filesLicences = files
    this.proPersonalForm.get('licenses')?.setValue(files);
  }
  previousStep() {
    this.isNext = false;

  }
  nextStep() {
    this.validatedFormPersonal()

  }
  validatedFormPersonal() {
    this.proPersonalForm.markAllAsTouched();
    if (this.proPersonalForm.invalid) {
      return;
    }
    this.isNext = true;

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
    this.proPersonalForm.markAllAsTouched();
    //si el resgistro es por primera vez y Personal
    if (this.isSelectOption === 'isPersonal' && !this.isNext) {
      if (this.proPersonalForm.valid) {

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
          if (this.filesLicences) {
            this.uploadsLicenses()

          }
        }
        //si es Personal pero solo edición 
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
          if (this.filesLicences) {
            this.uploadsLicenses()

          }
        }
      }
    }
    // si es Business 
    if (this.isSelectOption === 'isBusiness' && this.isNext) {
      this.proBusinessForm.markAllAsTouched();
      if (!this.proBusinessForm.valid) {
        return;
      }

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
        imageBusiness: this.proBusinessForm.value.imageBusiness || '',
        available: true
      };
      //si es primera vez
      if (!this.user.profile || !this.user.profile.id) {

        const isBusiness = false;
        this.userService.becomeToPro(profile).subscribe({
          next: (response) => {
            this.user.profile = response.profile
            this.handleSuccessfulSubmission(response);
            this.authService.updateUser('available', true);
            this.authService.updateUser('isPro', true);
            if (this.selectedFilePersonal) {
              this.uploadImage(this.selectedFilePersonal, false);
            }
            if (this.selectedFileBusiness != null) {
              this.uploadImage(this.selectedFileBusiness, true);
            }
          },
          error: (error) => this.handleError(error)
        });
        this.isDisabled = true;
      }
      else {
        //si es edicion de Business
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
      if (this.filesLicences) {
        this.uploadsLicenses()

      }
    }
  }
  uploadsLicenses() {
    const formData = new FormData();

    const files: FileList = this.proPersonalForm.get('licenses')?.value;

    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
    }
    this.uploadsService.postUploadsMulti(formData).subscribe({
      next: (response) => {
        const arrayFile = response.files;
        const nameFileArray = [];

        if (arrayFile.length > 0) {
          for (let i = 0; i < arrayFile.length; i++) {
            nameFileArray.push(arrayFile[i]['fileName'])

          }
          const image: Image = {
            name: nameFileArray
          };
          this.userService.uploadLicense(image).subscribe({
            next: (response) => {
              console.log(response.images)
              this.listImages = response.images;
            },
            error: (error) => this.handleError(error)
          });
        }

      },
      error: (error) => {
        console.error('Error al subir el archivo:', error);
      },
    });
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
      next: (response) => {

        if (response.uploads.urlImage) {
          if (this.selectedFilePersonal != null) {
            this.authService.updateUser('imagePersonal', `${response.uploads.urlImage}`);
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


