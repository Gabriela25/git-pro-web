import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Image } from '../../../interface/image.interface';

@Component({
  selector: 'app-license-upload',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './license-upload-form.component.html',
  styleUrls: ['./license-upload-form.component.css']
})
export class LicenseUploadFormComponent {
  @Input() parentForm!: FormGroup;
  @Input() previews: string[] = [];
  @Input() listImages: Image[] = [];
  @Input() errorMessage: string = '';
  @Input() urlUploads: string = '';

  @Output() removeImage = new EventEmitter<number>();
  @Output() removeExistingImage = new EventEmitter<number>();

  @ViewChild('fileInputLicenses') fileInputLicenses!: ElementRef<HTMLInputElement>;

   @Output() filesSelected = new EventEmitter<FileList>();
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files; 
    
    if (files) {
      this.filesSelected.emit(files); 
    } else {
      
      this.filesSelected.emit(new DataTransfer().files); 
    }
  }
  triggerFileInput(): void {
    this.fileInputLicenses.nativeElement.click();
  }
}