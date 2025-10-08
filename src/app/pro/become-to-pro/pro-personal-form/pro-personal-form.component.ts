import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  ViewChild,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  NgMultiSelectDropDownModule,
  IDropdownSettings,
} from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';
import { CapitalizeFirstDirective } from '../../../shared/directives/capitalize-first.directive';
import { NoWhitespaceDirective } from '../../../shared/directives/no-whitespace';
import { NgSelectModule } from '@ng-select/ng-select';
import { Category } from '../../../interface/category.interface';
import { ProCategoriesFormComponent } from '../pro-categories-form/pro-categories-form.component';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-pro-personal-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    NgSelectModule,
    ProCategoriesFormComponent,
    NgMultiSelectDropDownModule,
  ],
  templateUrl: './pro-personal-form.component.html',
  styleUrls: ['./pro-personal-form.component.css'],
})
export class ProPersonalFormComponent implements OnInit, OnChanges {
  urlUploads: string = environment.urlUploads;
  @Input() parentForm!: FormGroup;
  @Input() listCategories: any[] = [];
  @Input() listZipcode: any[] = [];
  @Input() previewImgPersonal: string | ArrayBuffer | null = null;
  @Input() imagePersonal: string = '';
  @Input() isPendingApproval: boolean = false;
  @Output() fileSelected = new EventEmitter<File>();
  @Input() dropdownSettings: any = {};

  @Output() categoriesChanged = new EventEmitter<void>();
  @ViewChild('fileInputPersonal')
  fileInputPersonal!: ElementRef<HTMLInputElement>;
  @Output() licensesChanged = new EventEmitter<any[]>();
  @Input() initialLicenses: any[] = [];

  selectedCategories: Category[] = [];
  readonly maxSelections = 3;
  alertMessage = '';
  backendMessage = '';
  isLoading = false;

  // Variables para zipcode dropdown
  selectedZipcodes: any[] = [];
  zipcodeDropdownSettings: IDropdownSettings = {};

  constructor() {}

  ngOnInit() {
    if (this.listZipcode && this.listZipcode.length > 0) {
      this.transformZipcodeData();
    }
    this.initializeZipcodeDropdown();
    
    // Esperar a que los datos estén transformados antes de poblar
    setTimeout(() => {
      this.populateSelectedZipcodes();
    }, 0);

    // Suscribirse a cambios del FormControl
    this.subscribeToZipcodeChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges triggered');
    
    if (changes['isPendingApproval']) {
      console.log('isPendingApproval changed to:', this.isPendingApproval);
      this.updateZipcodeDropdownSettings();
    }
    
    if (changes['listZipcode'] && this.listZipcode && this.listZipcode.length > 0) {
      console.log('listZipcode changed, transforming...');
      this.transformZipcodeData();
      setTimeout(() => {
        this.populateSelectedZipcodes();
      }, 100); // Dar tiempo para que la transformación se complete
    }
    
    // Si el parentForm cambia después de cargar datos del usuario
    if (changes['parentForm'] && this.parentForm) {
      setTimeout(() => {
        this.populateSelectedZipcodes();
      }, 100);
    }
  }

  subscribeToZipcodeChanges() {
    this.parentForm.get('zipcode')?.valueChanges.subscribe((zipcodeIds) => {
      console.log('Form zipcode value changed:', zipcodeIds);
      
      if (zipcodeIds && Array.isArray(zipcodeIds) && this.listZipcode && this.listZipcode.length > 0) {
        // Sincronizar selectedZipcodes con los nuevos IDs
        this.selectedZipcodes = this.listZipcode.filter((zipcode) =>
          zipcodeIds.includes(zipcode.id)
        );
        console.log('Synchronized selectedZipcodes:', this.selectedZipcodes);
      } else if (!zipcodeIds || zipcodeIds.length === 0) {
        this.selectedZipcodes = [];
      }
    });
  }

  transformZipcodeData() {
    // Transformar los datos para mostrar código + nombre
    this.listZipcode = this.listZipcode.map((zipcode) => ({
      ...zipcode,
      displayText: `${zipcode.code} - ${zipcode.name}`,
    }));
  }

  populateSelectedZipcodes() {
    console.log('=== POPULATE SELECTED ZIPCODES ===');
    console.log('Available zipcodes:', this.listZipcode?.length || 0);
    
    const formZipcodeValue = this.parentForm.get('zipcode')?.value;
    console.log('Form zipcode IDs:', formZipcodeValue);
    
    if (!this.listZipcode || this.listZipcode.length === 0) {
      console.log('No zipcode data available yet');
      return;
    }
    
    if (formZipcodeValue && Array.isArray(formZipcodeValue) && formZipcodeValue.length > 0) {
      // Encontrar los objetos completos basándose en los IDs
      this.selectedZipcodes = this.listZipcode.filter((zipcode) => {
        const isSelected = formZipcodeValue.includes(zipcode.id);
        if (isSelected) {
          console.log(`Found selected zipcode:`, zipcode);
        }
        return isSelected;
      });
      
      console.log(`Successfully populated ${this.selectedZipcodes.length} selected zipcodes`);
      console.log('Selected zipcodes objects:', this.selectedZipcodes);
    } else {
      console.log('No zipcode IDs in form');
      this.selectedZipcodes = [];
    }
  }

  initializeZipcodeDropdown() {
    // Configuración del dropdown
    this.updateZipcodeDropdownSettings();
  }

  updateZipcodeDropdownSettings(): void {
    this.zipcodeDropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'displayText',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 3,
      allowSearchFilter: !this.isPendingApproval, // Deshabilitar búsqueda si está pendiente
      searchPlaceholderText: 'Buscar zipcode...',
      enableCheckAll: !this.isPendingApproval, // Deshabilitar select all si está pendiente
    };
  }

  onZipcodeSelect(item: any) {
    if (this.isPendingApproval) {
      return;
    }
    
    console.log('Zipcode selected:', item);
    
    // selectedZipcodes ya está actualizado por el ngModel del dropdown
    // Solo necesitamos actualizar el FormControl
    const selectedIds = this.selectedZipcodes.map((z) => z.id);
    console.log('Current selected IDs:', selectedIds);
    
    this.parentForm.get('zipcode')?.setValue(selectedIds);
    this.parentForm.get('zipcode')?.markAsTouched();
    this.parentForm.get('zipcode')?.updateValueAndValidity();
  }

  onZipcodeDeSelect(item: any) {
    if (this.isPendingApproval) {
      return;
    }
    
    console.log('Zipcode deselected:', item);
    
    // selectedZipcodes ya está actualizado por el ngModel del dropdown
    const selectedIds = this.selectedZipcodes.map((z) => z.id);
    console.log('Remaining selected IDs:', selectedIds);
    
    this.parentForm.get('zipcode')?.setValue(selectedIds);
    this.parentForm.get('zipcode')?.markAsTouched();
    this.parentForm.get('zipcode')?.updateValueAndValidity();
  }

  onSelectAllZipcodes(items: any[]) {
    if (this.isPendingApproval) {
      return;
    }
    
    console.log('All zipcodes selected:', items.length);
    
    // selectedZipcodes ya está actualizado por el ngModel
    const selectedIds = this.selectedZipcodes.map((z) => z.id);
    this.parentForm.get('zipcode')?.setValue(selectedIds);
    this.parentForm.get('zipcode')?.markAsTouched();
    this.parentForm.get('zipcode')?.updateValueAndValidity();
  }

  onDeSelectAllZipcodes() {
    if (this.isPendingApproval) {
      return;
    }
    
    console.log('All zipcodes deselected');
    
    // selectedZipcodes ya está vacío por el ngModel
    this.parentForm.get('zipcode')?.setValue([]);
    this.parentForm.get('zipcode')?.markAsTouched();
    this.parentForm.get('zipcode')?.updateValueAndValidity();
  }

  triggerFileInput(): void {
    this.fileInputPersonal.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fileSelected.emit(input.files[0]);
    } else {
      this.fileSelected.emit(null!);
    }
  }

  onLicensesChangedFromChild(licenses: any[]) {
    this.licensesChanged.emit(licenses);
  }

  getImagePersonalSrc(): string {
    if (this.previewImgPersonal) {
      if (typeof this.previewImgPersonal === 'string') {
        return this.previewImgPersonal;
      } else if (this.previewImgPersonal instanceof ArrayBuffer) {
        const base64String = btoa(
          String.fromCharCode(...new Uint8Array(this.previewImgPersonal))
        );
        return `data:image/png;base64,${base64String}`;
      }
    }
    if (this.imagePersonal) return this.urlUploads + this.imagePersonal;
    return 'assets/avatar_profile.png';
  }

  // Método helper para obtener los zipcodes seleccionados (para el template)
  getSelectedZipcodes() {
    return this.selectedZipcodes;
  }
}
