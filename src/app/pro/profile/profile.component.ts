import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ComunicationService } from '../../services/comunication.service';
import { AutocompleteComponent } from '../../shared/autocomplete/autocomplete.component';
import { LicensesComponent } from './licenses/licenses.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    HeaderComponent,
    SidebarComponent,
    AutocompleteComponent,
    LicensesComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export default class ProfileComponent implements OnInit {
  firtsName: String = "Gabriela"
  email: String = "gabrielabarreto25@gmail.com"
  value : boolean =false;
  licenses: boolean = false;
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null | undefined= null;
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),


  });
  constructor(private comunication: ComunicationService) {

  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.registerForm.value);
  }

  direction: string = '';
  ngOnInit() {
  
    this.comunication.currentData.subscribe(direction => {

      console.log(direction)
      this.direction = direction;
      //this.comunication.triggerDirection().pipe(catchError(() => EMPTY)
    })

  }
  viewMaps(value: boolean) {
   this.value = value 
  }
  addLicenses( licenses: boolean){

    this.licenses = licenses;
  }
  handleEvent(licenses: boolean) {
    this.licenses = licenses;
  }
  onFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
       
        this.filePreview = e.target?.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
