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
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule
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
  ],
  templateUrl: './pro-personal-form.component.html',
  styleUrls: ['./pro-personal-form.component.css'], // Crea este archivo si necesitas estilos específicos
})
export class ProPersonalFormComponent {
  urlUploads: string = environment.urlUploads;
  @Input() parentForm!: FormGroup;
  @Input() listCategories: any[] = [];
  @Input() listZipcode: any[] = [];
  @Input() previewImgPersonal: string | ArrayBuffer | null = null;
  @Input() imagePersonal: string = '';
  @Output() fileSelected = new EventEmitter<File>();
  @Input() dropdownSettings: any = {};

  @Output() categoriesChanged = new EventEmitter<void>();
  @ViewChild('fileInputPersonal')
  fileInputPersonal!: ElementRef<HTMLInputElement>;
  @Output() licensesChanged = new EventEmitter<any[]>();
  @Input() initialLicenses: any[] = []; // Para recibir las licencias iniciales desde el padre

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
    //this.imagePersonal = ''
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
    // Si hay una imagen previa, la devuelve; si no, usa la imagen cargada o una por defecto
    if (this.previewImgPersonal) {
      if (typeof this.previewImgPersonal === 'string') {
        return this.previewImgPersonal;
      } else if (this.previewImgPersonal instanceof ArrayBuffer) {
        // Convert ArrayBuffer to base64 string for image src
        const base64String = btoa(
          String.fromCharCode(...new Uint8Array(this.previewImgPersonal))
        );
        return `data:image/png;base64,${base64String}`;
      }
    }
    if (this.imagePersonal) return this.urlUploads + this.imagePersonal;
    return 'assets/avatar_profile.png';
  }
}
