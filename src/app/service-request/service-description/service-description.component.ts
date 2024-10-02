import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { ContainerComponent } from '../../shared/container/container.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-service-description',
  standalone: true,
  imports: [
    TranslateModule,
    HeaderComponent,
    ContainerComponent,

  ],
  templateUrl: './service-description.component.html',
  styleUrl: './service-description.component.css'
})
export default class ServiceDescriptionComponent {
  label: string = 'Service description';
  idElement: string = 'serviceDescription';
  routerLink: string = 'service-request/service-description';
  selectedFile: File | null = null;
  previewImg: string | ArrayBuffer | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.previewImg = e.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
}
