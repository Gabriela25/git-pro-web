import { SelectedCategoryWithImage } from './../../../interface/selected-category-with-image.interface';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importa FormArray, FormControl
import { Category, } from './../../../interface/category.interface'; // Ajusta la ruta
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FloatingAlertComponent } from "../../../shared/floating-alert/floating-alert.component";
import { DomSanitizer } from '@angular/platform-browser';
// Ajusta la ruta

@Component({
  selector: 'app-pro-categories-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    FloatingAlertComponent
  ],

  // Ajusta tu selector
  templateUrl: './pro-categories-form.component.html', // Asegúrate de que la ruta sea correcta
  styleUrls: ['./pro-categories-form.component.css']
})
export class ProCategoriesFormComponent implements OnInit, OnChanges {
  hasPendingLicensesToSave = false;
  removeCategoryWithLicense: boolean = false;
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
  readonly maxSelections = 3; // Límite de selecciones
  @Output() licensesChanged = new EventEmitter<any[]>();
  @Input() initialLicenses: any[] = [];

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    // Asegurarse de que el FormControl 'categories' esté inicializado en el parentForm
    if (!this.parentForm.contains('categories')) {
      this.parentForm.addControl('categories', new FormControl([]));
      console.log(this.parentForm.contains('categories'))
    }
    // Inicializar selectedCategoryIdsInForm con el valor actual del formControl (si lo tiene)
    this.selectedCategoryIdsInForm = this.parentForm.get('categories')?.value || [];
    this.updateFinalSelectedCategories(); // Sincronizar al inicio

    // Suscribirse a los cambios en el formControl para mantener la sincronización
    this.parentForm.get('categories')?.valueChanges.subscribe((ids: string[]) => {
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

    if (changes['initialLicenses'] && this.initialLicenses?.length > 0 && this.listCategories?.length > 0) {
      console.log('Initial licenses changed:', this.initialLicenses);
      this.initializeFromEdit();
    }
  }
  initializeFromEdit(): void {
    // Paso 1: Cargar las categorías que tienen licencia
    this.selectedCategoryIdsInForm = this.initialLicenses.map(l => l.categoryId);

    const formSelectedCategoryAllIds = this.parentForm.get('categories')?.value || [];

    this.parentForm.get('categories')?.setValue(formSelectedCategoryAllIds);

    // Paso 3: Mapear categorías con licencia
    const withLicense: SelectedCategoryWithImage[] = this.initialLicenses.map(license => {
      const matchedCategory = this.listCategories.find(cat => cat.id === license.categoryId);

      if (!matchedCategory) return null;

      return {
        category: matchedCategory,
        uploadedImageBase64: this.sanitizer.bypassSecurityTrustResourceUrl(license.url),
        uploadedImageFile: null,
        title: license.title,
        mimetype: license.mimetype
      };
    }).filter(Boolean) as SelectedCategoryWithImage[];

    // Paso 4: Obtener categorías seleccionadas en el formulario (pueden incluir nuevas o sin licencia)
    const selectedCategoryIds = this.parentForm.get('categories')?.value as string[] || [];

    // Paso 5: Detectar categorías seleccionadas que no tienen licencia aún
    const newCategories = selectedCategoryIds
      .filter(id => !withLicense.find(wl => wl.category.id === id)) // categorías nuevas o sin licencia
      .map(id => {
        const matched = this.listCategories.find(cat => cat.id === id);
        if (!matched) return null;

        return {
          category: matched,
          uploadedImageBase64: null,
          uploadedImageFile: null,
          title: '',         // vacío porque no tiene licencia todavía
          mimetype: ''       // vacío también
        };
      })
      .filter(Boolean) as SelectedCategoryWithImage[];

    // Paso 6: Combinar todo
    this.finalSelectedCategoriesWithImages = [...withLicense, ...newCategories];
    console.log('Final categories with images:', this.finalSelectedCategoriesWithImages);
    // Paso 7: Preparar lista de solo categorías para enviar al backend
    this.selectedCategoriesToSend = this.finalSelectedCategoriesWithImages.map(entry => entry.category);
    console.log('Final categories with images:', this.finalSelectedCategoriesWithImages);
    console.log('Selected categories to send:', this.selectedCategoriesToSend);
  }


  onSelectChange(event: Event): void {

    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.value;

    // Evitar duplicados
    if (this.selectedCategoryIdsInForm.includes(selectedOption)) {
      return;
    }

    // Obtener la categoría completa y agregarla a selectedCategoriesToSend
    const selectedCategory = this.listCategories.find(cat => cat.id === selectedOption);

    if (
      selectedCategory &&
      !this.selectedCategoriesToSend.find(cat => cat.id === selectedCategory.id)

    ) {
      this.selectedCategoriesToSend.push(selectedCategory);
    }

    const updatedIds = [...this.selectedCategoryIdsInForm, selectedOption];

    if (updatedIds.length > this.maxSelections) {
      this.handleError({ error: { message: `You can only select a maximum of ${this.maxSelections} categories.` } });
      return;
    }

    this.parentForm.get('categories')?.setValue(updatedIds);
    this.showSelect = false;
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
      this.handleError({ error: { message: 'You must upload the file and title for all categories that require a license before selecting a new one.' } });

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
      this.filteredCategories = this.listCategories.filter(category =>
      (category.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
        category.name?.toLowerCase().includes(lowerCaseSearchTerm)) // Asumo que 'code' también puede ser relevante para buscar
      );
    }

    this.ensureSelectedVisibleInFilter();
  }

  ensureSelectedVisibleInFilter(): void {
    const currentSelectedCategories = this.finalSelectedCategoriesWithImages.map(item => item.category);
    currentSelectedCategories.forEach(selectedCat => {
      if (!this.filteredCategories.some(f => f.id === selectedCat.id)) {
        this.filteredCategories.push(selectedCat);
      }
    });

    this.filteredCategories.sort((a, b) => (a.name || '').localeCompare(b.name || '') || a.name.localeCompare(b.name));
  }


  updateFinalSelectedCategories(): void {
    const newFinalList: SelectedCategoryWithImage[] = [];

    this.selectedCategoryIdsInForm.forEach(selectedId => {
      const fullCategory = this.listCategories.find(cat => cat.id === selectedId);

      if (fullCategory) {
        const existingEntry = this.finalSelectedCategoriesWithImages.find(item => item.category.id === selectedId);
        if (existingEntry) {
          newFinalList.unshift(existingEntry); // Mantener la entrada existente con su imagen
        } else {
          newFinalList.unshift({ category: fullCategory, uploadedImageBase64: null, uploadedImageFile: null, title: '', mimetype: '' }); // Crear una nueva entrada sin imagen
        }
      }
    });

    this.finalSelectedCategoriesWithImages = newFinalList.filter(entry =>
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
        const entry = this.finalSelectedCategoriesWithImages.find(item => item.category.id === categoryId);
        if (entry) {
          entry.uploadedImageBase64 = reader.result;
          entry.uploadedImageFile = file;

        }
      };
      reader.readAsDataURL(file); // Leer como Base64 para previsualizar
    }
    this.hasPendingLicensesToSave = true
    //this.emitLicensesChanged();
  }

  // --- Eliminar una categoría de la lista de visualización ---
  removeSelectedCategory(categoryId: string): void {
    // Eliminar del array de IDs del FormControl
    const currentCategoryIds = this.parentForm.get('categories')?.value || [];
    const updatedCategoryIds = currentCategoryIds.filter((id: string) => id !== categoryId);
    this.parentForm.get('categories')?.setValue(updatedCategoryIds); // Esto disparará valueChanges y actualizará todo

    // Opcional: Si quieres ocultar el select si no quedan categorías
    if (updatedCategoryIds.length === 0) {
      this.showSelect = false;
    }
    const isCategoryLicensedRequired = this.listCategories.find(cat => cat.id === categoryId)?.licenseRequired;
    if (isCategoryLicensedRequired) {
      this.removeCategoryWithLicense = true;
 

    }
    /*if( this.selectedCategoriesToSend.length > 0) {
      this.finalSelectedCategoriesWithImages = this.finalSelectedCategoriesWithImages.filter(item => item.category.id !== categoryId);
    }*/
  }

  // --- Método para simular el guardado final ---
  onSubmitParentForm(): void {
    if (this.hasIncompleteRequiredLicenses()) {
      this.handleError({ error: { message: 'You must upload the file and title for all categories that require a license.' } });

      return;
    }
    const licensesToSend = this.finalSelectedCategoriesWithImages
      .filter(entry => entry.category.licenseRequired && entry.uploadedImageFile)
      .map(entry => ({
        categoryId: entry.category.id,
        title: entry.title || '',
        file: entry.uploadedImageFile
      }));

    if (this.selectedCategoryIdsInForm.length < this.maxSelections) {
      this.showSelect = true;
    } else {
      this.showSelect = false; // opcional, para ocultarlo si ya completó las 3
    }
    this.emitLicensesChanged();
  }
  hasIncompleteRequiredLicenses(): boolean {
    console.log('Checking for incomplete licenses...', this.finalSelectedCategoriesWithImages);
    return this.finalSelectedCategoriesWithImages.some(entry =>

      entry.category.licenseRequired &&
      ((!entry.uploadedImageFile && !entry.title) || !entry.uploadedImageBase64) // Verifica si no hay archivo o título
    );
  }


  emitLicensesChanged() {
    const licenses = this.finalSelectedCategoriesWithImages
      .filter(entry => entry.category.licenseRequired && entry.uploadedImageFile)
      .map(entry => ({
        categoryId: entry.category.id,
        title: entry.title || '',
        file: entry.uploadedImageFile,
        mimetype: entry.mimetype || ''
      }));
    console.log('Emitting licenses changed:', licenses);
    this.licensesChanged.emit(licenses);

    this.hasPendingLicensesToSave = false
  }

  handleError(error: any) {

    this.isLoading = false;
    this.backendMessage = '';
    setTimeout(() => {
      this.alertMessage = 'alert-danger';
      this.backendMessage = error.error.message || 'An error occurred';
    });

  }
  shouldShowUpdateLicenseButton(): boolean {
    
    return this.finalSelectedCategoriesWithImages.some(entry =>
      entry.category.licenseRequired
    );
  }
  isLicenseIncomplete(entry: SelectedCategoryWithImage): boolean | undefined {
    return (
      entry.category.licenseRequired &&
      ((!entry.uploadedImageFile && !entry.title) || !entry.uploadedImageBase64)
    );
  }
}