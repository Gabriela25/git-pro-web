import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  FormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CategoryService } from '../../services/category.service';
import { ZipcodeService } from '../../services/zipcode.service';

import { ModalComponent } from '../../shared/modal/modal.component';
import { Category } from '../../interface/category.interface';
import { Zipcode } from '../../interface/zipcode.interface';
import { Image } from '../../interface/image.interface';
import { FloatingAlertComponent } from '../../shared/floating-alert/floating-alert.component';
import { ProPersonalFormComponent } from './pro-personal-form/pro-personal-form.component';
import { ProBusinessFormComponent } from './pro-business-form/pro-business-form.component';
import { HeaderComponent } from '../../shared/header/header.component';
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
import { AuthService } from '../../services/auth.service';

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
    ModalComponent,
  ],
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
  categoryStatus: string = '';
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

      isBusiness: false,
    },
  };
  initialLicenses: {
    categoryId: string;
    title: string;
    url: string;
    mimetype: string;
  }[] = [];
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
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadInitialData();
  }
  checkUserProfile() {
    this.userService.getMe().subscribe({
      next: (response) => {
        this.user = response.user;
        console.log('User profile:', this.user);
        this.populateUserProfile();
      },
      error: (error) => console.error(error),
    });
  }
  populateUserProfile() {
    if (this.user.profile) {
      //asignamos si el perfil es personal o business
      this.isUserProPersonal = this.user.profile.isBusiness!;
      this.imagePersonal = `${this.user.profile.imagePersonal}`;
      // Asignacion de licencias del perfil
      console.log('Licenses from user profile:', this.user.profile.licenses);
      this.initialLicenses = (this.user.profile.licenses || []).map(
        (license: any) => ({
          categoryId: license.categoryId,
          title: license.title,
          url: `${this.urlUploads}${license.url}`,
          mimetype: license.mimetype || '',
        })
      );
      if (
        this.user.profile.profileCategories &&
        this.user.profile.profileCategories.length > 0
      ) {
        for (const category of this.user.profile.profileCategories) {
          if (category.status === 'PENDING_PAYMENT') {
            this.categoryStatus = category.status;
          }
        }
      }
      // Crear la estructura de licencias con la información necesaria para validación
      const initialLicensesForForm = this.user.profile.profileCategories.map(
        (pc) => {
          const existingLicense = this.initialLicenses.find(
            (license) => license.categoryId === pc.categoryId
          );
          const category = this.listCategories?.find(
            (cat) => cat.id === pc.categoryId
          );
          
          return {
            categoryId: pc.categoryId,
            title: existingLicense?.title || '',
            file: null,
            url: existingLicense?.url || '',
            mimetype: existingLicense?.mimetype || '',
            licenseRequired: category?.licenseRequired || false,
            stripeSubscriptionId: pc.stripeSubscriptionId || null,
            cancellationRequestedAt: pc.cancellationRequestedAt || null,
            status: pc.status || '',
          };
        }
      );
      console.log('Initial licenses for form:', initialLicensesForForm);
      this.proPersonalForm.patchValue({
        categories: this.user.profile.profileCategories.map(
          (pc) => pc.categoryId
        ),
        zipcode: this.user.profile.zipcodeId,
        address: this.user.profile.address,
        imagePersonal: `${this.user.profile.imagePersonal}`,
        introduction: this.user.profile.introduction,
        licenses: initialLicensesForForm,
      });
      if (this.user.profile.isBusiness) {
        this.isSelectOption = 'isBusiness';
        this.isDisabled = true;
        this.imageBusiness = `${this.user.profile.imageBusiness}`;
        this.proBusinessForm.patchValue({
          imageBusiness: `${this.user.profile.imageBusiness}`,
          nameBusiness: this.user.profile.nameBusiness,
          yearFounded: this.user.profile.yearFounded,
          numberOfemployees: this.user.profile.numberOfemployees,
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

  initForms(): void {
    this.proPersonalForm = this.fb.group({
      categories: new FormControl([], [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
      ]),
      imagePersonal: new FormControl(null, [Validators.required]),
      introduction: new FormControl(''),
      licenses: new FormControl([], [this.licenseConditionalValidator()]),
    });

    this.proBusinessForm = this.fb.group({
      nameBusiness: new FormControl('', [Validators.required]),
      yearFounded: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{4}$/),
      ]),
      numberOfemployees: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),
      imageBusiness: new FormControl(null, [Validators.required]),
    });
    this.proPersonalForm
      .get('licenses')
      ?.setValidators(this.licenseConditionalValidator());
    this.proPersonalForm.get('licenses')?.updateValueAndValidity();
  }
  onAccept() {
    console.log('onAccept called');
  }
  // Carga inicial de categorías y Zipcodes
  loadInitialData(): void {
    let categoriesLoaded = false;
    let zipcodesLoaded = false;

    const checkBothLoaded = () => {
      if (categoriesLoaded && zipcodesLoaded) {
        this.checkUserProfile();
      }
    };

    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        this.listCategories = response.categories;
        categoriesLoaded = true;
        checkBothLoaded();
      },
      error: (error) => this.handleError(error),
    });

    this.zipCodeService.getAllZipcodes().subscribe({
      next: (response) => {
        this.listZipcode = response.zipcodes;
        zipcodesLoaded = true;
        checkBothLoaded();
      },
      error: (error) => this.handleError(error),
    });
  }

  // Validador condicional para licencias (obligatorio si alguna categoría requiere licencia)
  licenseConditionalValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Si no hay formulario padre aún, no validar
      if (!this.proPersonalForm) {
        return null;
      }

      const selectedCategoryIds: string[] =
        this.proPersonalForm?.get('categories')?.value || [];
      const licensesData = control.value || [];

      // Si no hay categorías seleccionadas, no hay error
      if (selectedCategoryIds.length === 0) {
        console.log('No categories selected, validation passes');
        return null;
      }

      // Si no tenemos la lista de categorías cargada aún, no validar
      if (!this.listCategories || this.listCategories.length === 0) {
        console.log('Categories not loaded yet, skipping validation');
        return null;
      }

      // Verificar si hay categorías seleccionadas que requieren licencia
      const categoriesRequiringLicense = selectedCategoryIds.filter(
        (categoryId) => {
          const category = this.listCategories?.find(
            (cat) => cat.id === categoryId
          );
          const requiresLicense = category?.licenseRequired || false;
          return requiresLicense;
        }
      );

      if (categoriesRequiringLicense.length === 0) {
        return null; // No hay categorías que requieran licencia
      }

      // Verificar si todas las categorías que requieren licencia tienen datos completos
      const allLicensesComplete = categoriesRequiringLicense.every(
        (categoryId) => {
          const licenseData = licensesData.find(
            (lic: any) => lic.categoryId === categoryId
          );

          if (!licenseData) {
            console.log(`No license data for category ${categoryId}`);
            return false;
          }

          // Verificar si tiene archivo (nuevo) o url (existente)
          const hasFile =
            licenseData.file !== null && licenseData.file !== undefined;
          const hasUrl = licenseData.url && licenseData.url.trim() !== '';
          const hasTitle = licenseData.title && licenseData.title.trim() !== '';

          const isComplete = (hasFile || hasUrl) && hasTitle;

          return isComplete;
        }
      );

      return allLicensesComplete ? null : { licensesRequired: true };
    };
  }

  // Recepción del array de licencias emitido desde el hijo
  onLicensesChangedFromChild(categoriesData: any[]) {
    console.log('Received categories data from child:', categoriesData);

    // Crear el array completo de datos de licencias, preservando las existentes
    const allCategoriesForTracking = categoriesData.map((cat) => {
      // Buscar si existe una licencia existente para esta categoría
      const existingLicense = this.initialLicenses.find(
        (license) => license.categoryId === cat.categoryId
      );

      return {
        categoryId: cat.categoryId,
        title: cat.title || existingLicense?.title || '',
        file: cat.file || null,
        url: existingLicense?.url || '', // Preservar URL existente
        mimetype: cat.mimetype || existingLicense?.mimetype || '',
        licenseRequired: cat.licenseRequired,
      };
    });

    console.log('Final license data for form:', allCategoriesForTracking);
    this.proPersonalForm.get('licenses')?.setValue(allCategoriesForTracking);
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
      this.proPersonalForm.get('licenses')?.updateValueAndValidity();
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
    reader.onload = (e) => {
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
    reader.onload = (e) => {
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

    if (
      this.proPersonalForm.invalid ||
      this.isLicenceRequiredForSelectedCategories() === true
    ) {
      this.isLoading = false;

      if (this.isLicenceRequiredForSelectedCategories() === true) {
        this.handleError({
          error: {
            message:
              'Please complete all required license information for selected categories.',
          },
        });
        return;
      } else {
        this.handleError({
          error: {
            message:
              'Please complete all required fields in your personal profile.',
          },
        });
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

      // Verificar cada control individualmente
      Object.keys(this.proPersonalForm.controls).forEach((key) => {
        const control = this.proPersonalForm.get(key);
      });

      const licenseValidationResult =
        this.isLicenceRequiredForSelectedCategories();

      if (this.proPersonalForm.invalid || licenseValidationResult === true) {
        this.isLoading = false;
        if (licenseValidationResult === true) {
          this.handleError({
            error: {
              message:
                'Please complete all required license information for selected categories.',
            },
          });
          return;
        } else {
          this.handleError({
            error: {
              message:
                'Please complete all required fields in your personal profile.',
            },
          });
        }
        console.log(
          'Form invalid:',
          this.proPersonalForm.invalid,
          'License validation:',
          this.isLicenceRequiredForSelectedCategories()
        );
        return;
      }

      // Si el formulario personal es válido, procesar envío
      this.processFormSubmission(false);
    } else if (this.isSelectOption === 'isBusiness') {
      // Caso: Se envía el perfil de negocio (que incluye el personal)
      // 1. Marcar y validar el formulario personal
      this.proPersonalForm.markAllAsTouched();
      this.proPersonalForm.updateValueAndValidity();

      if (
        this.proPersonalForm.invalid ||
        this.isLicenceRequiredForSelectedCategories() === true
      ) {
        this.isLoading = false;

        if (this.isLicenceRequiredForSelectedCategories() === true) {
          this.handleError({
            error: {
              message:
                'Please complete all required license information for selected categories.',
            },
          });
          return;
        } else {
          this.handleError({
            error: {
              message:
                'Please complete all required fields in your personal profile.',
            },
          });
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

        this.handleError({
          error: {
            message:
              'Please complete all required fields in your personal profile.',
          },
        });
        return;
      }
      // Si ambos formularios son válidos, combinar y procesar envío
      this.processFormSubmission(true);
    }
  }

  isLicenceRequiredForSelectedCategories(): boolean {
    this.selectedCategoryIds =
      this.proPersonalForm.get('categories')?.value || [];
    const licensesData = this.proPersonalForm.get('licenses')?.value || [];

    // Si no hay categorías seleccionadas, no hay problema
    if (this.selectedCategoryIds.length === 0) {
      return false;
    }

    // Si no tenemos la lista de categorías, no podemos validar
    if (!this.listCategories || this.listCategories.length === 0) {
      console.log('Categories not loaded yet');
      return false;
    }

    // Verificar si hay categorías seleccionadas que requieren licencia pero no la tienen completa
    const incompleteRequired = this.selectedCategoryIds.some((categoryId) => {
      // Buscar la categoría en listCategories para verificar si requiere licencia
      const category = this.listCategories.find((cat) => cat.id === categoryId);

      if (!category?.licenseRequired) {
        console.log(`Category ${categoryId} does not require license`);
        return false; // No requiere licencia, está completa
      }

      console.log(`Category ${categoryId} requires license, checking data...`);

      // Si requiere licencia, verificar si tiene los datos completos
      const licenseData = licensesData.find(
        (lic: any) => lic.categoryId === categoryId
      );
      if (!licenseData) {
        console.log(`No license data found for category ${categoryId}`);
        return true; // Requiere licencia pero no tiene datos
      }

      // Verificar si tiene archivo (nuevo) o url (existente)
      const hasFile =
        licenseData.file !== null && licenseData.file !== undefined;
      const hasUrl = licenseData.url && licenseData.url.trim() !== '';
      const hasTitle = licenseData.title && licenseData.title.trim() !== '';

      const isComplete = (hasFile || hasUrl) && hasTitle;

      return !isComplete; // Incompleta si falta archivo/url o título
    });

    return incompleteRequired;
  }
  async processFormSubmission(isBusiness: boolean): Promise<void> {
    const isFirstTime = !this.user.profile || !this.user.profile.id;
    const allLicensesData = this.proPersonalForm.get('licenses')?.value || [];

    // Filtrar solo las licencias que requieren archivo (tienen licenseRequired = true y file)
    const licensesWithFiles = allLicensesData.filter(
      (lic: any) => lic.licenseRequired && lic.file
    );

    const combinedData = {
      ...this.proPersonalForm.value,
      ...(isBusiness ? this.proBusinessForm.value : {}),
      imagePersonalFile: this.selectedFilePersonal,
      imageBusinessFile: isBusiness ? this.selectedFileBusiness : null,
      licensesDetails: licensesWithFiles,
    };

    // Subir imágenes personales y empresariales
    combinedData.imagePersonal = combinedData.imagePersonalFile
      ? await this.uploadImageWithFile(combinedData.imagePersonalFile)
      : this.user.profile?.imagePersonal || '';

    combinedData.imageBusiness = isBusiness
      ? combinedData.imageBusinessFile
        ? await this.uploadImageWithFile(combinedData.imageBusinessFile)
        : this.user.profile?.imageBusiness || ''
      : '';

    if (isBusiness) {
      if (combinedData.imageBusinessFile) {
        combinedData.imageBusiness = await this.uploadImageWithFile(
          combinedData.imageBusinessFile
        );
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
                profileId: profileIdToUse,
              };

              this.licenseService.createLicense(licenseToCreate).subscribe({
                next: (res) =>
                  this.handleSuccessfulSubmission(response.message),
                error: (err) => this.handleError(err),
              });
            }
          } /*else {
           
          }*/
          //this.handleSuccessfulSubmission(response.message);
          console.log('Profile created antes de crear');
          this.authService.updateUser('isPro', true);

          if (response.profile.imagePersonal) {
            this.authService.updateUser(
              'imagePersonal',
              response.profile.imagePersonal
            );
          }
          this.checkUserProfile();
          this.handleSuccessfulSubmission(response.message);
          this.activateCategoryAndPay();
        },
        error: (err) => this.handleError(err),
      });
    } else {
      
      this.handleProfileEdit(profile, combinedData, profile.id!);
    }
  }
  async initiateStripeCheckout(profileId: string): Promise<void> {
    this.isLoadingPayment = true; // Activa el spinner de carga
    this.errorMessagePayment = null; // Limpia cualquier mensaje de error previo
    this.paymentInitiated = true; // Indica que el proceso de pago ha comenzado para mostrar la UI correspondiente

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
        this.errorMessagePayment =
          'No se pudo obtener la URL de pago de Stripe. Por favor, intenta de nuevo.';
        this.paymentInitiated = false; // Permite que el usuario reintente el pago
      }
    } catch (error: any) {
      // Este bloque 'catch' capturará cualquier error que ocurra durante la operación asíncrona:
      // - Errores de red
      // - Errores HTTP (4xx, 5xx) devueltos por el backend
      // - Errores lanzados explícitamente, como el de "Selecciona al menos una categoría".
      console.error('Error al crear la sesión de Checkout:', error);

      // Intenta obtener un mensaje de error más específico de la respuesta del backend
      this.errorMessagePayment =
        error.error?.message ||
        'Hubo un problema al iniciar el pago. Intenta más tarde.';
      this.paymentInitiated = false; // Permite que el usuario vea la opción de reintentar
    } finally {
      // El bloque 'finally' SIEMPRE se ejecuta después de que el bloque 'try' o 'catch' ha terminado.
      // Esto asegura que el spinner se desactive, sin importar el resultado.
      this.isLoadingPayment = false; // Desactiva el spinner
    }
  }
  retryPayment(): void {}
  goToCategorySelection(): void {
    this.router.navigate(['/profile/edit']); // O la ruta a tu selección de categorías
  }
  // Construye el objeto ProfileReq a partir de los datos combinados
  private buildProfile(combinedData: any, isBusiness: boolean): ProfileReq {
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
      }),
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
    return await firstValueFrom(
      this.uploadsService.postUploadsImageAll(formData)
    );
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
  private handleProfileEdit(
    profile: ProfileReq,
    combinedData: any,
    profileIdToUse: string
  ) {
    this.userService.updateMe({ ...this.user, profile }).subscribe({
      next: async (response) => {
        this.user = response.user;
        if (combinedData.licensesDetails.length > 0) {
          for (const license of combinedData.licensesDetails) {
            // Solo crear licencias nuevas (que tienen file pero no url)
            if (license.file && !license.url) {
              
              const licenseToCreate: License = {
                title: license.title || '',
                url: license.file || '',
                categoryId: license.categoryId || '',
                filename: license.file || '',
                profileId: this.user.profile?.id!,
              };
              this.licenseService.createLicense(licenseToCreate).subscribe({
                next: (res) => {
                  this.checkUserProfile();
                  this.handleSuccessfulSubmission(response.message);
                },
                error: (err) => this.handleError(err),
              });
            }
          }
        } else {
          this.handleSuccessfulSubmission(response.message);
        }
        if (response.user.profile?.imagePersonal) {
          this.authService.updateUser(
            'imagePersonal',
            response.user.profile.imagePersonal
          );
        }
        if(this.user.profile?.profileCategories && this.user.profile?.profileCategories.length > 0) {
          for (const category of this.user.profile.profileCategories) {
           
            if (category.status == 'PENDING_PAYMENT') {
              
              await this.activateCategoryAndPay()
              break
            }
          }
        }
         
        
      },
      error: (error) => this.handleError(error),
    });
  }

  async activateCategoryAndPay() {
    await this.initiateStripeCheckout(this.user.profile?.id!);
  }
}
