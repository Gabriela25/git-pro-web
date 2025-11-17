import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ZipcodeService } from '../../services/zipcode.service';
import { Zipcode } from '../../interface/zipcode.interface';
;
import { HeaderComponent } from '../../shared/header/header.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

import { Router } from '@angular/router';
import { UploadsService } from '../../services/uploads.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interface/category.interface';
import { SocketService } from '../../services/socket.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { LeadRegister } from '../../interface/lead-register.interface';
import { LeadService } from '../../services/lead.service';
import { UserService } from '../../services/user.service';
import { FloatingAlertComponent } from '../../shared/floating-alert/floating-alert.component';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'app-multi-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    NgxMaskDirective,
    ModalComponent,
    FloatingAlertComponent

  ],
  templateUrl: './multi-form.component.html',
  styleUrl: './multi-form.component.css'
})
export default class MultiFormComponent {

  currentStep: number = 1;
  categoryId: string = '';
  categoryName: string = '';
  zipcodeName: string = '';
  phone: string = '';
  description: string = '';
  listZipcode: Array<Zipcode> = [];
  listCategories: Array<Category> = [];
  leadForm: FormGroup;
  selectedOption: any;
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;

  isSelected = false;

  @ViewChild('modal') modal!: ModalComponent;

  previewImages: Record<string, string | ArrayBuffer | null> = {};
  selectedFiles: Record<string, File | null> = {};


  title: string = 'Lead';
  messageLead!: SafeHtml | string;
  isOpenModal: boolean = false;

  leadId: string = '';
  phoneUser: string = '';
  isPro: boolean= false;
  //previews: string[] = Array(6).fill('');
  isSubmitted: boolean = false;

  files: File[] = [];
  previews: string[] = [];
  errorMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private router: Router,
    private categoriesServices: CategoryService,
    private zipCodeService: ZipcodeService,
    private leadService: LeadService,
    private uploadsService: UploadsService,
    private socketService: SocketService,
    private authService: AuthService,
    private userService: UserService,
    
  ) {
    this.leadForm = this.fb.group({
      step1: this.fb.group({
        category: new FormControl('', [Validators.required]),
        zipcode: new FormControl('', [Validators.required]),
      }),
      step2: this.fb.group({    
        phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      }),
      step3: this.fb.group({      
        description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      }),
     
    });
  }

  ngOnInit() {
    this.leadService.lead$.subscribe((data: any) => {
      this.categoryName = data.categoryName;
      this.categoryId = data.categoryId;
    });
    this.zipCodeService.getAllZipcodes().subscribe({
      next: (response) => this.listZipcode = response.zipcodes,
      error: (error) => console.log(error)
    });
    this.categoriesServices.getAllCategories().subscribe({
      next: (response) => {
        this.listCategories = response.categories;
        const selectedCategory = this.listCategories.find(item => item.id === this.categoryId);
        if (selectedCategory) {
          this.leadForm.get('step1.category')?.setValue(selectedCategory);
        }
      },
      error: (error) => console.log(error)
    });
    this.socketService.getMessage('lead-created').subscribe((msg: any) => {
      this.onCreatedLead(msg);
    });

    this.socketService.getMessage('lead-accepted').subscribe(this.onAcceptedLead.bind(this));
    this.checkUser();
  }

  onFileSelected1(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      
      if (this.previews.length + files.length > 6) {
        this.errorMessage = 'You can only upload a maximum of 6 images.';
        return;
      }

      this.errorMessage = ''; 
      
      files.forEach(file => {
        this.files.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  openFileSelector(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  removeImage(index: number) {
    this.previews.splice(index, 1);
  }

 
  isDescriptionInvalid(): boolean {
    const descriptionControl = this.leadForm.get('step3.description');
    return descriptionControl?.errors?.['required'] && (descriptionControl.dirty || descriptionControl.touched);
  }
  
  checkUser(){
    this.userService.getMe().subscribe({
      next: (response) => {
        this.phoneUser = response.user.phone  
        this.leadForm.get('step2.phone')?.setValue(this.phoneUser);
      },
      error: (error) => console.error(error)
    });
    this.authService.user$.subscribe((data: any) => {
      if (data) {
        this.isPro = data.isPro || false; 
      }
    });
  }
  phoneNew(event: Event){
    const input = event.target as HTMLInputElement;
   
    if(input.checked){
      this.leadForm.get('step2.phone')?.setValue('');
    }
    else{
      this.leadForm.get('step2.phone')?.setValue(this.phoneUser);  
    }
  }
  onSelectionCategory() {
    const category = this.leadForm.get('step1')?.value.category
  
    this.leadService.updateDataLead('categoryId', category.id);
    this.leadService.updateDataLead('categoryName', category.name);
  }
  step(step: number) {
    if (step > this.currentStep) {

      if (this.currentStep === 1 && !this.leadForm.controls['zipcode'].valid) {
        return;
      }
      if (this.currentStep === 2 && !this.leadForm.controls['phone'].valid) {
        return;
      }
    }

    this.currentStep = step;

  }
  nextStep() {
    this.isSubmitted = true;
    this.leadForm.get('step1')?.markAllAsTouched()
    if (this.currentStep == 1) {
      if(this.leadForm.get('step1')?.valid){
        this.currentStep++;
      }
    }
    else if (this.currentStep == 2) {
      this.leadForm.get('step2')?.markAllAsTouched()
      if(this.leadForm.get('step2')?.valid){
        this.currentStep++;
      }

    }
    else{
      return;
    }
    
    if (this.leadForm.get('step1')!.value.zipcode) {
      this.zipcodeName = this.leadForm.get('step1')!.value.zipcode.name;
    }
    if (this.leadForm.get('step2')!.value.phone) {
      this.phone = this.leadForm.get('step2')!.value.phone;
    }
    if (this.leadForm.get('step3')!.value.description) {
      this.description = this.leadForm.value.phone.substring(0, 10) + ' ' + '...';
    }

  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
 
  
 
  async onSubmit() {
    
    this.leadForm.markAllAsTouched();
 
    if (this.leadForm.valid) {
      this.isLoading = true;
  
      const formLead = this.leadForm.value;
     
      const lead: LeadRegister = {
        categoryId: this.categoryId,
        zipcodeId: formLead.step1.zipcode.id,
        phone: formLead.step2.phone,
        description: formLead.step3.description,
        imageUrl1:'',
        imageUrl2:'',
        imageUrl3:'',
        imageUrl4:'',
        imageUrl5:'',
        imageUrl6:'',
      };
  
      
      const files = [
        { file: this.files[0], key: 'imageUrl1' },
        { file: this.files[1], key: 'imageUrl2' },
        { file: this.files[2], key: 'imageUrl3' },
        { file: this.files[3], key: 'imageUrl4' },
        { file: this.files[4], key: 'imageUrl5' },
        { file: this.files[5], key: 'imageUrl6' },
      ];
  
      
      for (const fileData of files) {
        
        if (fileData.file) {
          const formData = new FormData();
          formData.append('file', fileData.file);
          try {
          // Subir la imagen y obtener la URL
          const response = await this.uploadImage(formData);
          if (response.filePath !== 'Error al subir el archivo') {
            (lead as any)[fileData.key] = response.filePath;
          }

          response.filePath;

        } catch (error) {
            console.error(`Error asignando la URL para ${fileData.key}:`, error);
          }
        }
      }
      // Enviar datos al servidor por WebSocket
      this.socketService.sendMessage('create-lead', { lead });
    }
  }
  
  async uploadImage(formData: FormData): Promise<any> {
      return await firstValueFrom(this.uploadsService.postUploadsImageAll(formData, 'leads/images'));
  }
  onCreatedLead(payload: unknown) {
    if (!payload) {
      return;
    }
    if (typeof payload !== 'object') {
      return;
    }
    if (!('leads' in payload)) {
      return;
    }

    const { leads } = payload as { leads: LeadRegister };
    this.leadId = leads.id!;
    this.messageLead = this.sanitizer.bypassSecurityTrustHtml(`
        <div>
           <img src="/assets/check.png"           
           style="width: 120px; height: 120px; object-fit: cover; display: block; margin: 0 auto;" />
          <h3>Seraching professionals...</h3> 
        </div>
        <div class="d-flex justify-content-center mt-3">
            <div class="spinner-blead" role="status">
            </div>
        </div>
     `);
    this.openModal()


  }
  closeModal() {
    this.modal.close();
    this.isOpenModal = false;
  }
  openModal() {
    this.isLoading = false;
    this.modal.open();
    this.isOpenModal = true;
    this.startAlertTimer()
  }

  startAlertTimer() {
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      if(this.isPro){
        this.router.navigate(['/pro/leads'])
      }
      else{
        this.router.navigate(['/client/leads'])
      }
      //this.backendMessage = '';
    }, 1000);
  }
  onAcceptedLead(payload: unknown) {



    if (typeof payload !== 'object') {
      return;
    }

    if (!payload) {
      return;
    }

    if (!('professional' in payload)) {
      return;
    }

    const { professional } = payload as { professional: { fullname: string; image: string; introduction?: string } };
    this.title = 'Professionals';
    this.messageLead = this.sanitizer.bypassSecurityTrustHtml(`
      <div style="font-family: Arial, sans-serif;">
    <div style="text-align: center; margin-bottom: 20px;">
        ${professional.image
        ? `<img src="${professional.image}" 
                   class="rounded-circle img-pro"/>`
        : `<img src="assets/avatar_profile.png" 
                   class="rounded-circle img-pro"/>`}
        <span class="fullname-pro">
            ${professional.fullname}
        </span>
    </div>
          <div class="pt-3">
              <p style="margin: 0; font-size: 14px; line-height: 1.5;">
                  ${professional.introduction}
              </p>
          </div>
      </div>
    `);
    this.openModal()
  }

  onConfirmAction() {
    console.log("Confirmación del modal recibida");
    this.router.navigate([`/leads/detail/${this.categoryId}`])
    // Lógica después de confirmar la acción
  }
}
