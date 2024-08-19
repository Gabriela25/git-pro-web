import { Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ComunicationService } from '../../services/comunication.service';
import { AutocompleteComponent } from '../../shared/autocomplete/autocomplete.component';
import { LicensesComponent } from './licenses/licenses.component';
import { CategoryService } from '../../services/category.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NgxMaskDirective } from 'ngx-mask';

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
    LicensesComponent,
    ModalComponent,
    NgxMaskDirective
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export default class ProfileComponent implements OnInit {
  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('contentTemplate') contentTemplate!: TemplateRef<any>;
  @ViewChild('modalContainer', { static: false }) modalContainer!: ElementRef;
  content: SafeHtml | null = null;
  firtsName: String = "Gabriela"
  email: String = "gabrielabarreto25@gmail.com"
  value : boolean =false;
  licenses: boolean = false;
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null | undefined= null;
  listServices : Array<any>=[]
  listServicesPro : Array<any>=[]
 
    proOneForm: FormGroup;
    currentStep: number = 1;
  
    constructor(
      private fb: FormBuilder, 
      private category: CategoryService,
      private sanitizer: DomSanitizer,
      private renderer: Renderer2,
      private el: ElementRef
    ) {
      this.proOneForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required],
       
        category: ['', Validators.required],
        zipCode: ['', Validators.required],
        //nameBusiness: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        //yearFounded: ['', Validators.required],
        //numberEmployees: ['', Validators.required],
        address: ['', Validators.required]
      });
    }
  
    ngOnInit(): void {

      this.listServices = this.category.getCategory();
    }
  
    nextStep() {
      console.log(this.proOneForm.get('category')?.valid )
      console.log(this.proOneForm.get('zipCode')?.valid )
      console.log(this.proOneForm.get('phone')?.valid )
      this.currentStep++;
      /*if (this.currentStep === 1 && this.proOneForm.get('category')?.valid && this.proOneForm.get('zipCode')?.valid &&
       this.proOneForm.get('phone')?.valid ) {
        this.currentStep++;
      } else if (this.currentStep === 2 &&  this.proOneForm.get('address')?.valid) {
        this.currentStep++;
      }*/
    }
  
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    }
  
    goToStep(step: number) {
      if (step < this.currentStep || (step === 1 && this.proOneForm.get('category')?.valid  && this.proOneForm.get('zipCode')?.valid &&
      this.proOneForm.get('phone')?.valid ) || 
          (step === 2 &&  this.proOneForm.get('address')?.valid)) {
        this.currentStep = step;
      }
    }
  
    onSubmit() {
      if (this.proOneForm.valid) {
        console.log('Form Submitted', this.proOneForm.value);
      }
    }
    loadDynamicContent() {
      let optionsHtml = '';
      // Ejemplo de generación dinámica de opciones
     
      this.listServices.forEach(service => {
        optionsHtml += `<option value="${service}">${service}</option>`;
      });
  
      // Sanitizar el HTML generado dinámicamente para seguridad
      const content = this.sanitizer.bypassSecurityTrustHtml(`
        <p>This is dynamic content rendered inside the modal.</p>
        <select class="form-control" (change)="onSelectChange($event)">
          ${optionsHtml}
        </select>
      `);
    }

  openModal() {
    //this.modal.title = 'Select an Option';
    let optionsHtml = '';
    this.listServices.forEach(service => {
      optionsHtml += `<option value="${service.name}">${service.name}</option>`;
    });
    const content = `
      <p>This is dynamic content rendered inside the modal.</p>
        <select class="form-control" (change)="onSelectChange2($event)">
          ${optionsHtml}
        </select>`;
   
    this.modal.setContent(content);
   
    
    
    this.modal.open();
  }
  
  onSelectChange(event:any) {
    console.log("desde el padre")
    
      console.log('Selected value:', (event.target as HTMLSelectElement).value);
    }
     //Perform any additional actions with the selected value
  
}
