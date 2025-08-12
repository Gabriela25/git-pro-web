import { SelectedCategoryWithImage } from './../../../interface/selected-category-with-image.interface';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'; // Importa FormArray, FormControl
import { Category } from './../../../interface/category.interface'; // Ajusta la ruta
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FloatingAlertComponent } from '../../../shared/floating-alert/floating-alert.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CheckStripeService } from '../../../services/checkout-stripe.service';
import e from 'express';
import { profile } from 'console';
declare var bootstrap: any;
// Ajusta la ruta

@Component({
  selector: 'app-pro-categories-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FloatingAlertComponent,
  ],

  // Ajusta tu selector
  templateUrl: './pro-categories-form.component.html', // Asegúrate de que la ruta sea correcta
  styleUrls: ['./pro-categories-form.component.css'],
})
export class ProCategoriesFormComponent implements OnInit, OnChanges {
  hasPendingLicensesToSave = false;
  @Input() parentForm!: FormGroup;
  @Input() listCategories: Category[] = [];

  showSelect: boolean = false;
  searchTerm: string = '';
  filteredCategories: Category[] = [];

  // Esta variable se vinculará al <select multiple> y contendrá los IDs seleccionados
  selectedCategoryIdsInForm: string[] = [];

  // Esta será la lista final que mostraremos y procesaremos con objetos completos e imágenes
  finalSelectedCategoriesWithImages: SelectedCategoryWithImage[] = [];
  selectedCategoriesToSend: Category[] = [];
  isLoading: boolean = false;
  backendMessage: string = '';
  alertMessage: string = '';
  readonly maxSelections = 5; // Límite de selecciones
  @Output() licensesChanged = new EventEmitter<any[]>();
  @Input() initialLicenses: any[] = [];
  stripeSubscriptionId: string | null = null;
  profileCategoryId: string = '';
  errorMessagePayment: string | null = null;
  paymentInitiated: boolean = false;
  constructor(
    private sanitizer: DomSanitizer,
    private checkoutStripeService: CheckStripeService
  ) {}

  ngOnInit() {
    // Asegurarse de que el FormControl 'categories' esté inicializado en el parentForm
    if (!this.parentForm.contains('categories')) {
      this.parentForm.addControl('categories', new FormControl([]));
      console.log(this.parentForm.contains('categories'));
    }
    // Inicializar selectedCategoryIdsInForm con el valor actual del formControl (si lo tiene)
    this.selectedCategoryIdsInForm =
      this.parentForm.get('categories')?.value || [];
    this.updateFinalSelectedCategories(); // Sincronizar al inicio

    // Suscribirse a los cambios en el formControl para mantener la sincronización
    this.parentForm
      .get('categories')
      ?.valueChanges.subscribe((ids: string[]) => {
        this.selectedCategoryIdsInForm = ids || [];
        this.updateFinalSelectedCategories();
      });

    // Inicializar la lista filtrada
    this.filterCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected:', changes);
    if (changes['listCategories']) {
      this.filterCategories();
      this.updateFinalSelectedCategories();
    }

    if (
      changes['initialLicenses'] &&
      this.initialLicenses?.length > 0 &&
      this.listCategories?.length > 0
    ) {
      console.log('Initial licenses changed:', this.initialLicenses);
      this.initializeFromEdit();
    }
  }
  initializeFromEdit(): void {
    // Paso 1: Cargar las categorías que tienen licencia
    this.selectedCategoryIdsInForm = this.initialLicenses.map(
      (l) => l.categoryId
    );

    const formSelectedCategoryAllIds =
      this.parentForm.get('categories')?.value || [];

    this.parentForm.get('categories')?.setValue(formSelectedCategoryAllIds);
    console.log(
      'Selected category IDs in form:',
      this.parentForm.get('licenses')
    );
    // Paso 3: Mapear categorías con licencia
    const categoriesAllLicenses = this.parentForm.get('licenses')?.value || [];
    const withLicense: SelectedCategoryWithImage[] = this.initialLicenses
      .map((license) => {
        const matchedCategory = this.listCategories.find(
          (cat) => cat.id === license.categoryId
        );

        if (!matchedCategory) return null;

        return {
          category: matchedCategory,
          uploadedImageBase64: this.sanitizer.bypassSecurityTrustResourceUrl(
            license.url
          ),
          uploadedImageFile: null,
          title: license.title,
          mimetype: license.mimetype,
          status:
            categoriesAllLicenses.find(
              (cat: any) => cat.categoryId === license.categoryId
            )?.status || '',
          stripeSubscriptionId:
            categoriesAllLicenses.find(
              (cat: any) => cat.categoryId === license.categoryId
            )?.stripeSubscriptionId || null,
          cancellationRequestedAt:
            categoriesAllLicenses.find(
              (cat: any) => cat.categoryId === license.categoryId
            )?.cancellationRequestedAt || null,
        };
      })
      .filter(Boolean) as SelectedCategoryWithImage[];

    // Paso 4: Obtener categorías seleccionadas en el formulario (pueden incluir nuevas o sin licencia)
    const selectedCategoryIds =
      (this.parentForm.get('categories')?.value as string[]) || [];

    // Paso 5: Detectar categorías seleccionadas que no tienen licencia aún
    const newCategories = selectedCategoryIds
      .filter((id) => !withLicense.find((wl) => wl.category.id === id)) // categorías nuevas o sin licencia
      .map((id) => {
        const matched = this.listCategories.find((cat) => cat.id === id);
        if (!matched) return null;

        return {
          category: matched,
          uploadedImageBase64: null,
          uploadedImageFile: null,
          title: '', // vacío porque no tiene licencia todavía
          mimetype: '', // vacío también
          status:
            categoriesAllLicenses.find((cat: any) => cat.categoryId === id)
              ?.status || '',
          stripeSubscriptionId:
            categoriesAllLicenses.find((cat: any) => cat.categoryId === id)
              ?.stripeSubscriptionId || null,
          cancellationRequestedAt:
            categoriesAllLicenses.find((cat: any) => cat.categoryId === id)
              ?.cancellationRequestedAt || null,
        };
      })
      .filter(Boolean) as SelectedCategoryWithImage[];

    // Paso 6: Combinar todo
    this.finalSelectedCategoriesWithImages = [...withLicense, ...newCategories];
    console.log(
      'Final categories with images:',
      this.finalSelectedCategoriesWithImages
    );
    // Paso 7: Preparar lista de solo categorías para enviar al backend
    this.selectedCategoriesToSend = this.finalSelectedCategoriesWithImages.map(
      (entry) => entry.category
    );
    console.log(
      'Final categories with images:',
      this.finalSelectedCategoriesWithImages
    );
    console.log('Selected categories to send:', this.selectedCategoriesToSend);

    // Emitir cambios automáticamente después de inicializar
    setTimeout(() => this.emitLicensesChanged(), 100);
  }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.value;

    // Evitar duplicados
    if (this.selectedCategoryIdsInForm.includes(selectedOption)) {
      return;
    }

    // Obtener la categoría completa y agregarla a selectedCategoriesToSend
    const selectedCategory = this.listCategories.find(
      (cat) => cat.id === selectedOption
    );

    if (
      selectedCategory &&
      !this.selectedCategoriesToSend.find(
        (cat) => cat.id === selectedCategory.id
      )
    ) {
      this.selectedCategoriesToSend.push(selectedCategory);
    }

    const updatedIds = [...this.selectedCategoryIdsInForm, selectedOption];

    if (updatedIds.length > this.maxSelections) {
      this.handleError({
        error: {
          message: `You can only select a maximum of ${this.maxSelections} categories.`,
        },
      });
      return;
    }

    this.parentForm.get('categories')?.setValue(updatedIds);
    this.showSelect = false;

    // Emitir cambios automáticamente al seleccionar una nueva categoría
    setTimeout(() => this.emitLicensesChanged(), 100); // Timeout para asegurar que se actualice la lista primero
  }

  // --- Lógica de visibilidad del select ---
  toggleSelectVisibility(): void {
    console.log('Toggle select visibility called');
    if (this.showSelect) {
      // Si ya está abierto, simplemente se cierra
      this.showSelect = false;
      this.searchTerm = '';
      this.filterCategories();
      return;
    }

    // Validar si hay licencias requeridas incompletas
    if (this.hasIncompleteRequiredLicenses()) {
      this.handleError({
        error: {
          message:
            'You must upload the file and title for all categories that require a license before selecting a new one.',
        },
      });

      return;
    }

    // Abrir el selector si no hay errores
    this.showSelect = true;
  }

  // --- Lógica de filtrado para el select ---
  filterCategories(): void {
    if (!this.searchTerm) {
      this.filteredCategories = [...this.listCategories];
    } else {
      const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
      this.filteredCategories = this.listCategories.filter(
        (category) =>
          category.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
          category.name?.toLowerCase().includes(lowerCaseSearchTerm) // Asumo que 'code' también puede ser relevante para buscar
      );
    }

    this.ensureSelectedVisibleInFilter();
  }

  ensureSelectedVisibleInFilter(): void {
    const currentSelectedCategories =
      this.finalSelectedCategoriesWithImages.map((item) => item.category);
    currentSelectedCategories.forEach((selectedCat) => {
      if (!this.filteredCategories.some((f) => f.id === selectedCat.id)) {
        this.filteredCategories.push(selectedCat);
      }
    });

    this.filteredCategories.sort(
      (a, b) =>
        (a.name || '').localeCompare(b.name || '') ||
        a.name.localeCompare(b.name)
    );
  }

  updateFinalSelectedCategories(): void {
    const newFinalList: SelectedCategoryWithImage[] = [];

    this.selectedCategoryIdsInForm.forEach((selectedId) => {
      const fullCategory = this.listCategories.find(
        (cat) => cat.id === selectedId
      );

      if (fullCategory) {
        const existingEntry = this.finalSelectedCategoriesWithImages.find(
          (item) => item.category.id === selectedId
        );
        if (existingEntry) {
          newFinalList.unshift(existingEntry); // Mantener la entrada existente con su imagen
        } else {
          newFinalList.unshift({
            category: fullCategory,
            uploadedImageBase64: null,
            uploadedImageFile: null,
            title: '',
            mimetype: '',
            status: '',
            stripeSubscriptionId: null,
            cancellationRequestedAt: null,
          }); // Crear una nueva entrada sin imagen
        }
      }
    });

    this.finalSelectedCategoriesWithImages = newFinalList.filter((entry) =>
      this.selectedCategoryIdsInForm.includes(entry.category.id)
    );
  }

  // --- Manejo de la carga de imagen ---
  onFileSelected(event: Event, categoryId: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        const entry = this.finalSelectedCategoriesWithImages.find(
          (item) => item.category.id === categoryId
        );
        if (entry) {
          entry.uploadedImageBase64 = reader.result;
          entry.uploadedImageFile = file;
          // Emitir cambios automáticamente al cargar un archivo
          this.emitLicensesChanged();
        }
      };
      reader.readAsDataURL(file); // Leer como Base64 para previsualizar
    }
    this.hasPendingLicensesToSave = true;
  }

  // --- Eliminar archivo cargado ---
  removeUploadedFile(categoryId: string): void {
    const entry = this.finalSelectedCategoriesWithImages.find(
      (item) => item.category.id === categoryId
    );
    if (entry) {
      entry.uploadedImageBase64 = null;
      entry.uploadedImageFile = null;
      entry.title = '';
      entry.mimetype = '';
      this.hasPendingLicensesToSave = true;
      // Emitir cambios automáticamente al eliminar un archivo
      this.emitLicensesChanged();
    }
  }

  // --- Eliminar una categoría de la lista de visualización ---
  removeSelectedCategory(categoryId: string): void {
    // Eliminar del array de IDs del FormControl
    const currentCategoryIds = this.parentForm.get('categories')?.value || [];
    const updatedCategoryIds = currentCategoryIds.filter(
      (id: string) => id !== categoryId
    );
    this.parentForm.get('categories')?.setValue(updatedCategoryIds); // Esto disparará valueChanges y actualizará todo

    // Opcional: Si quieres ocultar el select si no quedan categorías
    if (updatedCategoryIds.length === 0) {
      this.showSelect = false;
    }

    // Emitir cambios después de eliminar una categoría
    this.emitLicensesChanged();
  }

  // --- Método para manejar cambios en el título ---
  onTitleChange(): void {
    // Emitir cambios cuando se modifica el título
    this.emitLicensesChanged();
  }

  // --- Validación de licencias incompletas ---
  hasIncompleteRequiredLicenses(): boolean {
    console.log(
      'Checking for incomplete licenses...',
      this.finalSelectedCategoriesWithImages
    );
    return this.finalSelectedCategoriesWithImages.some(
      (entry) =>
        entry.category.licenseRequired &&
        ((!entry.uploadedImageFile && !entry.title) ||
          !entry.uploadedImageBase64) // Verifica si no hay archivo o título
    );
  }

  emitLicensesChanged() {
    // Emitir todas las categorías seleccionadas con sus datos de licencia
    const allCategories = this.finalSelectedCategoriesWithImages.map(
      (entry) => ({
        categoryId: entry.category.id,
        title: entry.title || '',
        file: entry.uploadedImageFile,
        mimetype: entry.mimetype || '',
        licenseRequired: entry.category.licenseRequired,
        stripeSubscriptionId: entry.stripeSubscriptionId || null,
        cancellationRequestedAt: entry.cancellationRequestedAt || null,
      })
    );

    console.log('Emitting licenses changed:', allCategories);
    this.licensesChanged.emit(allCategories);
    this.hasPendingLicensesToSave = false;
  }

  handleError(error: any) {
    this.isLoading = false;
    this.backendMessage = '';
    setTimeout(() => {
      this.alertMessage = 'alert-danger';
      this.backendMessage = error.error.message || 'An error occurred';
    });
  }

  isLicenseIncomplete(entry: SelectedCategoryWithImage): boolean | undefined {
    return (
      entry.category.licenseRequired &&
      ((!entry.uploadedImageFile && !entry.title) || !entry.uploadedImageBase64)
    );
  }

  // Método que se llama al cambiar el switch
  onToggleSubscription(entry: any) {
    this.profileCategoryId = entry.id;
    if (entry.status === 'ACTIVE' || entry.status === 'REACTIVATED') {
      this.stripeSubscriptionId = entry.stripeSubscriptionId;
      const modalEl = document.getElementById('cancelSubscriptionModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    } else {
      if (entry.status === 'CANCEL_AT_PERIOD_END') {
        this.stripeSubscriptionId = entry.stripeSubscriptionId;
        const modalEl = document.getElementById('cancelSubscriptionModal');
        if (modalEl) {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }
      }
      if (entry.status === 'CANCELED' || entry.stripeSubscriptionId === '') {
        this.stripeSubscriptionId = entry.stripeSubscriptionId;
        const modalEl = document.getElementById('reactiveSubscriptionModal');
        if (modalEl) {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        }
      }
    }
  }

  confirmCancelSubscription() {
    if (!this.stripeSubscriptionId) return;

    this.checkoutStripeService
      .cancelSubscription(this.stripeSubscriptionId)
      .subscribe({
        next: (response) => {
          console.log(
            'Subscription cancelled successfully:',
            response.profileCategory
          );
          // Actualiza el estado localmente o vuelve a cargar los datos
          this.stripeSubscriptionId = null;
          // Puedes cerrar el modal usando Bootstrap
          const modalEl = document.getElementById('cancelSubscriptionModal');
          if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
          }
          // Mostrar alerta o notificación de éxito
        },
        error: (error) => {
          //this.handleError()
          // Manejar error
        },
      });
  }

  confirmReactiveSubscription() {
    if (!this.stripeSubscriptionId) return;
    this.checkoutStripeService
      .reactiveSubscription(this.stripeSubscriptionId)
      .subscribe({
        next: (response) => {
          console.log(
            'Subscription cancelled successfully:',
            response.profileCategory
          );
          // Actualiza el estado localmente o vuelve a cargar los datos
          this.stripeSubscriptionId = null;
          // Puedes cerrar el modal usando Bootstrap
          const modalEl = document.getElementById('cancelSubscriptionModal');
          if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
          }
          // Mostrar alerta o notificación de éxito
        },
        error: (error) => {
          //this.handleError()
          // Manejar error
        },
      });
  }
  newSubscription() {
    this.checkoutStripeService
      .newSubscriptionByCategoryExists(this.profileCategoryId)
      .subscribe({
        next: (response) => {
          console.log(
            'New subscription created successfully:',
            response.checkoutStripe
          );
        

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

          const modalEl = document.getElementById('newSubscriptionModal');
          if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
          }
          // Mostrar alerta o notificación de éxito
        },
        error: (error) => {
          //this.handleError()
          // Manejar error
        },
      });
    const modalEl = document.getElementById('newSubscriptionModalLabel');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }
}
