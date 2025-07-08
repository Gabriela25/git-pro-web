import { Component, Input, Output, EventEmitter, OnInit, ElementRef, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule
import { CapitalizeFirstDirective } from '../../../shared/directives/capitalize-first.directive';
import { NoWhitespaceDirective } from '../../../shared/directives/no-whitespace';
import { NgSelectModule } from '@ng-select/ng-select';
import { Category } from '../../../interface/category.interface';
import { ProCategoriesFormComponent } from '../pro-categories-form/pro-categories-form.component';


@Component({
  selector: 'app-pro-personal-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    NgSelectModule,
    ProCategoriesFormComponent
    
],
  templateUrl: './pro-personal-form.component.html',
  styleUrls: ['./pro-personal-form.component.css'] // Crea este archivo si necesitas estilos específicos
})
export class ProPersonalFormComponent   {
  @Input() parentForm!: FormGroup;
  @Input() listCategories: any[] = [];
  @Input() listZipcode: any[] = [];
  
  @Input() previewImgPersonal: string | ArrayBuffer | null = null;
  @Input() imagePersonal: string = '';
  @Output() fileSelected = new EventEmitter<File>();
  @Input() dropdownSettings : any = {};
  
  @Output() categoriesChanged = new EventEmitter<void>(); // Nuevo evento para notificar cambios en categorías
  @ViewChild('fileInputPersonal') fileInputPersonal!: ElementRef<HTMLInputElement>;
  @Output() licensesChanged = new EventEmitter<any[]>();
  selectedCategories: Category[] = [];
  readonly maxSelections = 3;
  alertMessage = '';
  backendMessage = '';
  isLoading = false;
  constructor() {}
  

 

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
    const hasIncomplete = licenses.some(l => l.licenseRequired && !l.isComplete);
    if (hasIncomplete) {
      this.parentForm.get('categories')?.setErrors({ incompleteLicenses: true });
    } else {
      this.parentForm.get('categories')?.setErrors(null);
    }

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