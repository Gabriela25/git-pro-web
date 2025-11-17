import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pro-business-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './pro-business-form.component.html',
  styleUrls: ['./pro-business-form.component.css']
})
export class ProBusinessFormComponent {
  
  @Input() parentForm!: FormGroup;
  @Input() previewImgBusiness: string | ArrayBuffer | null = null;
  @Input() imageBusiness: string = '';
  @Input() isPendingApproval: boolean = false;

  @Output() fileSelected = new EventEmitter<File>();

  @ViewChild('fileInputBusiness') fileInputBusiness!: ElementRef<HTMLInputElement>;

  validateNumber(event: KeyboardEvent): void {
    const charCode = event.keyCode ? event.keyCode : event.which;
    if ((charCode < 48 || charCode > 57) && charCode !== 8 && charCode !== 9) {
      event.preventDefault();
    }
  }

  

  triggerFileInput(): void {
    this.fileInputBusiness.nativeElement.click();
  }
  onFileSelected(event: Event): void { 
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fileSelected.emit(input.files[0]);
    } else {
      this.fileSelected.emit(null!);
    }
  }
  getImageBusinessSrc(): string {
  // Si hay una imagen previa, la devuelve; si no, usa la imagen cargada o una por defecto
  if (this.previewImgBusiness) {
    if (typeof this.previewImgBusiness === 'string') {
      return this.previewImgBusiness;
    } else if (this.previewImgBusiness instanceof ArrayBuffer) {
      // Convert ArrayBuffer to base64 string for image src
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(this.previewImgBusiness))
      );
      return `data:image/png;base64,${base64String}`;
    }
  }
  if (this.imageBusiness) return  this.imageBusiness;
  return 'assets/avatar_profile.png';
}
} 
