import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

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
} 
