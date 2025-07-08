import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CategoryService } from '../../services/category.service';
import { ZipcodeService } from '../../services/zipcode.service';

import { ModalComponent } from '../../shared/modal/modal.component';
import { Category } from '../../interface/category.interface';
import { Zipcode } from '../../interface/zipcode.interface';
import { Image } from '../../interface/image.interface';
import { FloatingAlertComponent } from '../../shared/floating-alert/floating-alert.component';
import { ProPersonalFormComponent } from './pro-personal-form/pro-personal-form.component';
import { ProBusinessFormComponent } from "./pro-business-form/pro-business-form.component";
import { HeaderComponent } from "../../shared/header/header.component";
import { CommonModule } from '@angular/common';
import e from 'express';
import { UserService } from '../../services/user.service';
import { User } from '../../interface/user.interface';
import { Profile } from '../../interface/profile.interface';
import { UploadsService } from '../../services/uploads.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-become-to-pro',
  templateUrl: './become-to-pro.component.html',
  styleUrl: './become-to-pro.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FloatingAlertComponent,
    ProPersonalFormComponent,
    TranslateModule,
    ProBusinessFormComponent,
    FormsModule,
    HeaderComponent,
    ModalComponent
  ]
})
export default class BecomeToProComponent implements OnInit {
  @ViewChild('modal') modal!: ModalComponent;

  proPersonalForm!: FormGroup;
  proBusinessForm!: FormGroup;

  isSelectOption: 'isPersonal' | 'isBusiness' = 'isPersonal';
  showOptsPro = true;
  isNext = false;
  currentStep = 1;
  alertMessage = '';
  backendMessage = '';
  isLoading = false;
  onSelect: boolean = false;
  isUserProPersonal: boolean = false;
  showBusinessTab: boolean = false;
  isDisabled: boolean = false;

  listCategories: Category[] = [];
  listZipcode: Zipcode[] = [];
  dropdownSettings = {};


  previewImgPersonal: string | ArrayBuffer | null = 'assets/avatar_profile.png';
  selectedFilePersonal: File | null = null;

  previewImgBusiness: string | ArrayBuffer | null = 'assets/avatar_profile.png';
  selectedFileBusiness: File | null = null;

  filesLicences: File[] = [];
  previews: string[] = [];
  listImages: Image[] = [];
  imagesToDelete: Image[] = [];
  errorMessage = '';
  imageBusiness: string = '';
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
    private translate: TranslateService,
    private categoryService: CategoryService,
    private zipCodeService: ZipcodeService,
    private userService: UserService,
    private uploadsService:UploadsService
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadInitialData();
    this.checkUserProfile();


  }
  checkUserProfile() {
    this.userService.getMe().subscribe({
      next: (response) => {
        this.user = response.user;
        this.populateUserProfile()
      },
      error: (error) => console.error(error)
    });
  }
  populateUserProfile() {

    if (this.user.profile) {
      //asignamos si el perfil es personal o business
      this.isUserProPersonal = this.user.profile.isBusiness!;

      //this.imagePersonal = `${this.urlUploads}${this.user.profile.imagePersonal}`;

      this.proPersonalForm.patchValue({
        categories: this.user.profile.categories,
        zipcode: this.user.profile.zipcodeId,
        address: this.user.profile.address,
        //imagePersonal: `${this.urlUploads}${this.user.profile.imagePersonal}`,
        introduction: this.user.profile.introduction
      });
      if (this.user.profile.isBusiness) {
        this.isSelectOption = 'isBusiness';
        this.isDisabled = true;

        //this.imageBusiness = `${this.urlUploads}${this.user.profile.imageBusiness}`;
        this.proBusinessForm.patchValue({
          //imageBusiness : `${this.urlUploads}${this.user.profile.imageBusiness}`,
          nameBusiness: this.user.profile.nameBusiness,
          yearFounded: this.user.profile.yearFounded,
          numberOfemployees: this.user.profile.numberOfemployees
        });
      }

    }
  }
  ngAfterViewInit(): void {

    if (this.showOptsPro) {
      setTimeout(() => {
        this.openModalOnPageLoad();

      }, 0);
    }
  }
  openModalOnPageLoad() {

    if (this.modal) {
      this.modal.open();
    }
  }

  initForms(): void {
    this.proPersonalForm = this.fb.group({
      categories: new FormControl([], [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required, Validators.minLength(10)]),
      imagePersonal: new FormControl(null, [Validators.required]),
      introduction: new FormControl(''),
      licenses: new FormControl([], [this.licenseConditionalValidator()])
    });

    this.proBusinessForm = this.fb.group({
      nameBusiness: new FormControl('', [Validators.required]),
      yearFounded: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}$/)]),
      numberOfemployees: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      imageBusiness: new FormControl(null, [Validators.required])
    });
    this.proPersonalForm.get('licenses')?.setValidators(this.licenseConditionalValidator());
    this.proPersonalForm.get('licenses')?.updateValueAndValidity()

  }
  onAccept() { }
  loadInitialData(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.listCategories = response.categories;
        // Disparar validación por si dependiera de categorías
        this.proPersonalForm.get('licenses')?.updateValueAndValidity();
      },
      error: console.error
    });

    this.zipCodeService.getAllZipcodes().subscribe({
      next: (response) => this.listZipcode = response.zipcodes,
      error: console.error
    });
    this.openModalOnPageLoad();
  }

  // Validador condicional para licencias (obligatorio si alguna categoría requiere licencia)
  licenseConditionalValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const categories: Category[] = this.proPersonalForm?.get('categories')?.value || [];
      const licenses = control.value || [];

      const requiresLicense = categories.some(cat => cat.licenseRequired === true);
      if (requiresLicense && (!licenses || licenses.length === 0)) {
        return { licensesRequired: true };
      }
      return null;
    };
  }

  // Recepción del array de licencias emitido desde el hijo
  onLicensesChangedFromChild(licenses: any[]) {

    this.proPersonalForm.get('licenses')?.setValue(licenses);
    this.proPersonalForm.get('licenses')?.updateValueAndValidity();
  }

  onRadioChange(event: Event) {
    this.onSelect = true;
    const target = event.target as HTMLInputElement;

    this.isSelectOption = target.value as 'isPersonal' | 'isBusiness';

    if (this.isSelectOption === 'isPersonal') {
      this.isUserProPersonal = true;
      this.showBusinessTab = false;
      this.currentStep = 1;


      this.proPersonalForm.get('licences')?.updateValueAndValidity();
      this.proPersonalForm.get('categories')?.updateValueAndValidity();
    } else {
      this.isUserProPersonal = false;
      this.showBusinessTab = true;
      this.currentStep = 2;


    }
  }
  onFileSelectedPersonal(file: File): void {
    this.selectedFilePersonal = file;

    this.proPersonalForm.get('imagePersonal')?.setValue(file);

    const reader = new FileReader();
    reader.onload = e => {

      this.previewImgPersonal = e.target?.result || null;
    };
    reader.readAsDataURL(file);

    this.proPersonalForm.get('imagePersonal')?.markAsTouched();
    this.proPersonalForm.get('imagePersonal')?.updateValueAndValidity();
  }

  onFileSelectedBusiness(file: File): void {
    this.selectedFileBusiness = file;
    this.proBusinessForm.get('imageBusiness')?.setValue(file);

    const reader = new FileReader();
    reader.onload = e => {
      this.previewImgBusiness = e.target?.result || null;
    };
    reader.readAsDataURL(file);

    this.proBusinessForm.get('imageBusiness')?.markAsTouched();
    this.proBusinessForm.get('imageBusiness')?.updateValueAndValidity();
  }

  // Control de pasos (personal/business)
  /* nextStep(): void {
     this.proPersonalForm.markAllAsTouched();
     this.proPersonalForm.updateValueAndValidity();
 
     if (this.proPersonalForm.invalid) {
       
       return;
     }
 
     this.isNext = true;
     this.currentStep = 2;
     this.isSelectOption = 'isBusiness';
   }*/
  nextStep(): void {
    // Validar el formulario personal antes de pasar al de negocio
    this.proPersonalForm.markAllAsTouched();
    this.proPersonalForm.updateValueAndValidity();

    if (this.proPersonalForm.invalid || this.isLicenceRequiredForSelectedCategories() === true) {
      this.isLoading = false;

      if (this.isLicenceRequiredForSelectedCategories() === true) {
        this.handleError({ error: { message: 'Press the add categories button' } });
        return;
      } else {
        this.handleError({ error: { message: 'Please complete all required fields in your personal profile.' } });
      }
      return;
    }
    this.isNext = true;
    this.currentStep = 2;
    this.isSelectOption = 'isBusiness';
  }

  previousStep(): void {
    this.isNext = false;
    if (this.currentStep === 2 && this.isSelectOption === 'isBusiness') {
      this.currentStep = 1;
      this.isSelectOption = 'isPersonal';
    } else if (this.currentStep === 1 && this.isSelectOption === 'isPersonal') {
      this.showOptsPro = true;
    }
  }


  // Método submit final
  /*onSubmit(): void {
    this.proPersonalForm.markAllAsTouched();
    this.proPersonalForm.updateValueAndValidity();
    if (this.isSelectOption === 'isPersonal') {
     

      if (this.proPersonalForm.invalid) {
         return;
      }else{
        const selectedCategoryIds: string[] = this.proPersonalForm.get('categories')?.value || [];

        const selectedCategories = this.listCategories.filter(cat =>
          selectedCategoryIds.includes(cat.id)
        );
        
        const categoriesThatRequireLicense = selectedCategories.filter(cat => cat.licenseRequired);
        const hasLicenseRequired = categoriesThatRequireLicense.length;
        if( hasLicenseRequired !=this.proPersonalForm.get('licenses')?.value.length){
         this.handleError({ error: { message: 'Press the add categories button' } });
          return;
        }

        console.log('Datos para enviar:', this.proPersonalForm.value);
        console.log('Archivo imagen personal:', this.selectedFilePersonal);
        console.log('Licencias:', this.proPersonalForm.get('licenses')?.value);

        this.alertMessage = this.translate.instant('FORM_SUBMITTED_SUCCESSFULLY');
        this.backendMessage = '';
        this.isLoading = true;
        
        // Aquí llamarías tu servicio para enviar los datos al backend
      }
    
    }else if (this.isSelectOption === 'isBusiness') {
        this.proBusinessForm.markAllAsTouched();
        this.proBusinessForm.updateValueAndValidity();

        if (this.proBusinessForm.invalid) {
          return;
        } else {
          console.log('Datos para enviar:', this.proBusinessForm.value);
          console.log('Archivo imagen negocio:', this.selectedFileBusiness);

          this.alertMessage = this.translate.instant('FORM_SUBMITTED_SUCCESSFULLY');
          this.backendMessage = '';
          this.isLoading = true;

          // Aquí llamarías tu servicio para enviar los datos al backend
        }
      }
   
    // Similar lógica para isBusiness si quieres manejarlo aquí
  }*/
  onSubmit(): void {
    this.isLoading = true;
    
    if (this.isSelectOption === 'isPersonal') {

      this.proPersonalForm.markAllAsTouched();
      this.proPersonalForm.updateValueAndValidity(); // Forzar validación


      if (this.proPersonalForm.invalid || this.isLicenceRequiredForSelectedCategories() === true) {
        this.isLoading = false;

        if (this.isLicenceRequiredForSelectedCategories() === true) {
          this.handleError({ error: { message: 'Press the add categories button' } });
          return;
        } else {
          this.handleError({ error: { message: 'Please complete all required fields in your personal profile.' } });
        }
        return;
      }

      // Si el formulario personal es válido, procesar envío
     
      this.processPersonalFormSubmission();

    } else if (this.isSelectOption === 'isBusiness') {
      // Caso: Se envía el perfil de negocio (que incluye el personal)

      // 1. Marcar y validar el formulario personal
      this.proPersonalForm.markAllAsTouched();
      this.proPersonalForm.updateValueAndValidity();

      if (this.proPersonalForm.invalid || this.isLicenceRequiredForSelectedCategories() === true) {
        this.isLoading = false;
        this.isLoading = false;

        if (this.isLicenceRequiredForSelectedCategories() === true) {
          this.handleError({ error: { message: 'Press the add categories button' } });
          return;
        } else {
          this.handleError({ error: { message: 'Please complete all required fields in your personal profile.' } });
        }
        // Opcional: regresar al paso 1 si el error es en el formulario personal
        this.currentStep = 1;
        this.isSelectOption = 'isPersonal';
        this.isNext = false;
        return;
      }

      // 2. Marcar y validar el formulario de negocio
      this.proBusinessForm.markAllAsTouched();
      this.proBusinessForm.updateValueAndValidity();

      if (this.proBusinessForm.invalid) {
        this.isLoading = false;

        this.handleError({ error: { message: 'Please complete all required fields in your personal profile.' } });
        return;
      }

      // Si ambos formularios son válidos, combinar y procesar envío
      this.processBusinessFormSubmission();
    }
  }

  isLicenceRequiredForSelectedCategories(): boolean {
    const selectedCategoryIds: string[] = this.proPersonalForm.get('categories')?.value || [];

    const selectedCategories = this.listCategories.filter(cat =>
      selectedCategoryIds.includes(cat.id)
    );

    const categoriesThatRequireLicense = selectedCategories.filter(cat => cat.licenseRequired);
    const hasLicenseRequired = categoriesThatRequireLicense.length;
    if ((hasLicenseRequired != this.proPersonalForm.get('licenses')?.value.length)) {

      return true;
    }
    return false;
  }
  async  processPersonalFormSubmission(): Promise<void> {
    const isFirstTime = !this.user.profile || !this.user.profile.id;
   
    const combinedData = {
      ...this.proPersonalForm.value,
      imagePersonalFile: this.selectedFilePersonal,
      isPersonalProfile: true,
      isBusinessProfile: false,
      licensesDetails: this.proPersonalForm.get('licenses')?.value


    };
     ///;
    
     const imagePersonalFile = await this.uploadImageWithFile(combinedData.imagePersonalFile);
     console.log('Archivo imagen personal:', imagePersonalFile);
     combinedData.imagePersonal = imagePersonalFile || '';
   
    //delete combinedData.licenses;
    const profile = this.buildProfile(combinedData, false, isFirstTime)
    console.log('Datos COMBINADOS para enviar (Solo Personal):', combinedData);
    this.userService.becomeToPro(profile).subscribe({
      next: (response) => {
        console.log('Perfil creado o actualizado:', response.profile);
      },
      error: (error) => this.handleError(error)
    });
    
  }

  private processBusinessFormSubmission(): void {

    const combinedData = {
      ...this.proPersonalForm.value,
      ...this.proBusinessForm.value,
      imagePersonalFile: this.selectedFilePersonal,
      imageBusinessFile: this.selectedFileBusiness,
      isPersonalProfile: true,
      isBusinessProfile: true,
      licensesDetails: this.proPersonalForm.get('licenses')?.value
    };


    delete combinedData.licenses;

    console.log('Datos COMBINADOS para enviar (Personal + Business):', combinedData);

    this.handleSuccessfulSubmission(this.translate.instant('FORM_SUBMITTED_SUCCESSFULLY'));
  }

   private buildProfile(combinedData: any,
    isBusiness: boolean,
   
    isFirstTime: boolean
  ): Profile {
   
    return {
      categories: combinedData.categories || [],
      zipcodeId: combinedData.zipcode || '',
      address: combinedData.address || '',
      imagePersonal: combinedData.imagePersonal || '',
      introduction: combinedData.introduction,
      isBusiness,
      licenses: combinedData.licensesDetails || [],
      
      ...(isBusiness && {
        nameBusiness: combinedData.nameBusiness || '',
        yearFounded: combinedData.yearFounded || '',
        numberOfemployees: combinedData.numberOfemployees || '',
        imageBusiness:  ''
      })
    };
  }
  private async uploadImageWithFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await this.uploadImage(formData);
    console.log('Imagen subida exitosamente:', response);
    return response.fileName; 
  } catch (error) {
    this.handleError(error);
    throw error;
  }
}

async uploadImage(formData: FormData): Promise<any> {
  return await firstValueFrom(this.uploadsService.postUploadsImageAll(formData));
}
    
  handleSuccessfulSubmission(message: string) {
    this.isLoading = false;
    this.backendMessage = '';
    setTimeout(() => {
      this.alertMessage = 'alert-success';
      this.backendMessage = message || 'Profile updated successfully';
    });
  }
  handleError(error: any) {
    this.isLoading = false;
    this.backendMessage = '';
    setTimeout(() => {
      this.alertMessage = 'alert-danger';
      this.backendMessage = error.error.message || 'An error occurred';
    });

  }

}
