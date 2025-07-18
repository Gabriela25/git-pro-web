import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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

import { UserService } from '../../services/user.service';
import { User } from '../../interface/user.interface';
import { Profile } from '../../interface/profile.interface';
import { UploadsService } from '../../services/uploads.service';
import { firstValueFrom } from 'rxjs';
import { LicenseService } from '../../services/license.service';
import { title } from 'process';
import { License } from '../../interface/license.interace';
import { environment } from '../../../environments/environment.development';
import { CheckStripeService } from '../../services/checkout-stripe.service';
import { Router } from '@angular/router';
import { ProfileReq } from '../../interface/profile-req.interface';


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
  urlUploads = environment.urlUploads;
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

  imagePersonal: string = '';
  imageBusiness: string = '';
  previewImgPersonal: string | ArrayBuffer | null = null;
  selectedFilePersonal: File | null = null;

  previewImgBusiness: string | ArrayBuffer | null = null;
  selectedFileBusiness: File | null = null;

  filesLicences: File[] = [];
  previews: string[] = [];
  listImages: Image[] = [];
  imagesToDelete: Image[] = [];
  errorMessage = '';

  user: User = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    profile: {
      id: '',
      profileCategories: [],
      zipcodeId: '',
      address: '',
      imagePersonal: '',
      introduction: '',

      isBusiness: false
    }
  }
  initialLicenses: { categoryId: string; title: string; url: string; mimetype: string }[] = [];
  isLoadingPayment: boolean = false;
  errorMessagePayment: string | null = null;
  paymentInitiated: boolean = false;
  selectedCategoryIds: string[] = [];
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private categoryService: CategoryService,
    private zipCodeService: ZipcodeService,
    private userService: UserService,
    private uploadsService: UploadsService,
    private licenseService: LicenseService,
    private checkStripe: CheckStripeService,


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
      this.imagePersonal = `${this.user.profile.imagePersonal}`;
      // Asignacion de licencias del perfil
      this.initialLicenses = (this.user.profile.licenses || []).map((license: any) => ({
        categoryId: license.categoryId,
        title: license.title,
        url: `${this.urlUploads}${license.url}`,
        mimetype: license.mimetype || '',
      }));

      this.proPersonalForm.patchValue({
        categories: this.user.profile.profileCategories.map((pc) => pc.categoryId),
        zipcode: this.user.profile.zipcodeId,
        address: this.user.profile.address,
        imagePersonal: `${this.user.profile.imagePersonal}`,
        introduction: this.user.profile.introduction,
        licenses: this.initialLicenses
      });
      if (this.user.profile.isBusiness) {
        this.isSelectOption = 'isBusiness';
        this.isDisabled = true;
        this.imageBusiness = `${this.user.profile.imageBusiness}`;
        this.proBusinessForm.patchValue({
          imageBusiness: `${this.user.profile.imageBusiness}`,
          nameBusiness: this.user.profile.nameBusiness,
          yearFounded: this.user.profile.yearFounded,
          numberOfemployees: this.user.profile.numberOfemployees
        });
      }
    }
    else {
      this.openModalOnPageLoad();
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
  onAccept() {
    console.log('onAccept called');
  }
  // Carga inicial de categorías y Zipcodes
  loadInitialData(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.listCategories = response.categories;
        // Disparar validación por si dependiera de categorías
        // TODO: Revisar si es necesario
        //this.proPersonalForm.get('categories')?.updateValueAndValidity();
      },
      error: (error) => this.handleError(error)
    });

    this.zipCodeService.getAllZipcodes().subscribe({
      next: (response) => this.listZipcode = response.zipcodes,
      error: (error) => this.handleError(error)
    });

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

  nextStep(): void {
    // Validar el formulario personal antes de pasar al de business
    this.proPersonalForm.markAllAsTouched();
    this.proPersonalForm.updateValueAndValidity();

    if (this.proPersonalForm.invalid || this.isLicenceRequiredForSelectedCategories() === true) {
      this.isLoading = false;

      if (this.isLicenceRequiredForSelectedCategories() === true) {
        this.handleError({ error: { message: 'Press the update licenses button' } });
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
      this.isSelectOption = 'isBusiness';
    } else if (this.currentStep === 1 && this.isSelectOption === 'isPersonal') {
      this.showOptsPro = true;
    }
  }


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
      this.processFormSubmission(false);

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
      this.processFormSubmission(true);
    }
  }

  isLicenceRequiredForSelectedCategories(): boolean {
    this.selectedCategoryIds = this.proPersonalForm.get('categories')?.value || [];
    const licenses = this.proPersonalForm.get('licenses')?.value || [];
    // Filtrar solo las licencias que están dentro de las categorías seleccionadas
    const matchedLicenses = licenses.filter((lic: any) =>
      this.selectedCategoryIds.includes(lic.categoryId)
    );
    
    // Verificar si alguna de esas licencias no tiene archivo
    const incomplete = matchedLicenses.some((lic: any) =>
      !lic.file || lic.file == null || lic.file === ''
    );
    
    return incomplete;
  }
  async processFormSubmission(isBusiness: boolean): Promise<void> {
    const isFirstTime = !this.user.profile || !this.user.profile.id;
    const combinedData = {
      ...this.proPersonalForm.value,
      ...(isBusiness ? this.proBusinessForm.value : {}),
      imagePersonalFile: this.selectedFilePersonal,
      imageBusinessFile: isBusiness ? this.selectedFileBusiness : null,
      licensesDetails: this.proPersonalForm.get('licenses')?.value || []
    };

    // Subir imágenes personales y empresariales
    combinedData.imagePersonal = combinedData.imagePersonalFile
      ? await this.uploadImageWithFile(combinedData.imagePersonalFile)
      : this.user.profile?.imagePersonal || '';

    combinedData.imageBusiness = isBusiness
      ? (combinedData.imageBusinessFile
        ? await this.uploadImageWithFile(combinedData.imageBusinessFile)
        : this.user.profile?.imageBusiness || '')
      : '';

    if (isBusiness) {
      if (combinedData.imageBusinessFile) {
        combinedData.imageBusiness = await this.uploadImageWithFile(combinedData.imageBusinessFile);
      } else if (!isFirstTime) {
        combinedData.imageBusiness = this.user.profile?.imageBusiness || '';
      } else {
        combinedData.imageBusiness = '';
      }
    }

    // Subir archivos de licencias (si existen)
    for (const license of combinedData.licensesDetails) {
      if (license.file) {
        license.file = await this.uploadImageWithFile(license.file);
      }
    }

    const profile = this.buildProfile(combinedData, isBusiness);
    let profileIdToUse: string;
    if (isFirstTime) {
      this.userService.becomeToPro(profile).subscribe({
        next: async (response) => {
          profileIdToUse = response.profile.id ?? '';
          // Crear licencias asociadas al perfil
          if (combinedData.licensesDetails.length > 0) {
            for (const license of combinedData.licensesDetails) {
              const licenseToCreate: License = {
                title: license.title || '',
                url: license.file || '',
                categoryId: license.categoryId || '',
                filename: license.file || '',
                profileId: profileIdToUse
              };

              this.licenseService.createLicense(licenseToCreate).subscribe({
                next: (res) => this.handleSuccessfulSubmission(response.message),
                error: (err) => this.handleError(err)
              });
            }
          } /*else {
            await this.initiateStripeCheckout(profileIdToUse);
          }*/
          this.handleSuccessfulSubmission(response.message);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.handleProfileEdit(profile, combinedData, profile.id!);
     
    }
  }
  async initiateStripeCheckout(profileId: string): Promise<void> {
    this.isLoadingPayment = true;        // Activa el spinner de carga
    this.errorMessagePayment = null;     // Limpia cualquier mensaje de error previo
    this.paymentInitiated = true;        // Indica que el proceso de pago ha comenzado para mostrar la UI correspondiente

    try {
      const categoryIds = this.selectedCategoryIds; // Obtiene los IDs de las categorías seleccionadas
      if (!categoryIds || categoryIds.length === 0) {
        // Si no se ha seleccionado ninguna categoría, lanza un error y sale
        throw new Error('Selecciona al menos una categoría para continuar.');
      }

      // --- ESTA ES LA CORRECCIÓN CRÍTICA ---
      // Convertimos el Observable a una Promesa y esperamos a que se resuelva.
      // Opción para RxJS 7+:
      const response = await firstValueFrom(
        this.checkStripe.createCheckoutSession(profileId, categoryIds)
      );
      // O, si estás usando una versión anterior de RxJS y 'toPromise()' no está deprecado o lo tienes importado:
      // const response = await this.checkStripe.createCheckoutSession(profileId, categoryIds).toPromise();


      // Una vez que 'await' ha finalizado, 'response' contendrá la respuesta exitosa del backend.
      if (response && response.checkoutStripe.url) {
        window.location.href = response.checkoutStripe.url; // Redirige al usuario a la página de pago de Stripe
        // La ejecución de este método se detendrá aquí ya que el navegador cambia de página.
      } else {
        // Este bloque se ejecutaría si el backend respondiera OK, pero sin la URL esperada.
        // (Lo cual sería un error en el backend si siempre debe devolver una URL).
        this.errorMessagePayment = 'No se pudo obtener la URL de pago de Stripe. Por favor, intenta de nuevo.';
        this.paymentInitiated = false; // Permite que el usuario reintente el pago
      }

    } catch (error: any) {
      // Este bloque 'catch' capturará cualquier error que ocurra durante la operación asíncrona:
      // - Errores de red
      // - Errores HTTP (4xx, 5xx) devueltos por el backend
      // - Errores lanzados explícitamente, como el de "Selecciona al menos una categoría".
      console.error('Error al crear la sesión de Checkout:', error);

      // Intenta obtener un mensaje de error más específico de la respuesta del backend
      this.errorMessagePayment = error.error?.message || 'Hubo un problema al iniciar el pago. Intenta más tarde.';
      this.paymentInitiated = false; // Permite que el usuario vea la opción de reintentar
    } finally {
      // El bloque 'finally' SIEMPRE se ejecuta después de que el bloque 'try' o 'catch' ha terminado.
      // Esto asegura que el spinner se desactive, sin importar el resultado.
      this.isLoadingPayment = false; // Desactiva el spinner
    }
  }
  retryPayment(): void {

  }
  goToCategorySelection(): void {
    this.router.navigate(['/profile/edit']); // O la ruta a tu selección de categorías  
  }
  // Construye el objeto ProfileReq a partir de los datos combinados
  private buildProfile(combinedData: any,
    isBusiness: boolean,
  ): ProfileReq {

    return {
      categoryIds: combinedData.categories || [],
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
        imageBusiness: combinedData.imageBusiness || '',
      })
    };
  }
  // Método para subir una imagen y obtener su nombre de archivo
  private async uploadImageWithFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await this.uploadImage(formData);

      return response.fileName;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async uploadImage(formData: FormData): Promise<any> {
    return await firstValueFrom(this.uploadsService.postUploadsImageAll(formData));
  }

  handleSuccessfulSubmission(message?: string) {
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
  private handleProfileEdit(profile: ProfileReq, combinedData: any, profileIdToUse: string) {

    this.userService.updateMe({ ...this.user, profile }).subscribe({
      next: (response) => {
     
        if (combinedData.licensesDetails.length > 0) {
          for (const license of combinedData.licensesDetails) {
            const licenseToCreate: License = {
              title: license.title || '',
              url: license.file || '',
              categoryId: license.categoryId || '',
              filename: license.file || '',
              profileId: this.user.profile?.id!
            };
            this.licenseService.createLicense(licenseToCreate).subscribe({
              next: (res) => {
                this.checkUserProfile()
                this.handleSuccessfulSubmission(response.message);
              },
              error: (err) => this.handleError(err)
            });
          }
          this.handleSuccessfulSubmission(response.message);
        }

      },
      error: (error) => this.handleError(error)
    });
  }
}
