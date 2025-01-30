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
    ModalComponent

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
  selectedFile1: File | null = null;
  selectedFile2: File | null = null;
  selectedFile3: File | null = null;
  selectedFile4: File | null = null;
  selectedFile5: File | null = null;
  selectedFile6: File | null = null;

  selectedOption: any;
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;

  isSelected = false;

  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('fileInput1') fileInput1!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput2') fileInput2!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput3') fileInput3!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput4') fileInput4!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput5') fileInput5!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput6') fileInput6!: ElementRef<HTMLInputElement>;
  previewImages: Record<string, string | ArrayBuffer | null> = {};
selectedFiles: Record<string, File | null> = {};
  urlUploads: string = environment.urlUploads || '';

  title: string = 'Lead';
  messageLead!: SafeHtml | string;
  isOpenModal: boolean = false;

  leadId: string = '';
  phoneUser: string = '';
  isPro: boolean= false;
  //previews: string[] = Array(6).fill('');
  isSubmitted: boolean = false;
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
        imageUrl1: new FormControl('',[Validators.required]),
        imageUrl2: new FormControl('',[Validators.required]),
        imageUrl3: new FormControl('',[Validators.required]),
        imageUrl4: new FormControl('',[Validators.required]),
        imageUrl5: new FormControl('',[Validators.required]),
        imageUrl6: new FormControl('',[Validators.required])
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
  areImagesInvalid(): boolean {
    const step3 = this.leadForm.get('step3');
    if (!step3) return false;
  
    
    return [1, 2, 3, 4, 5, 6].some(i => {
      const control = step3.get(`imageUrl${i}`);
      return control?.errors?.['required'] && (control.dirty || control.touched);
    });
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
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fileNumber = input.id.replace('fileInput', ''); // Extrae el número (1-6)
  
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        this.previewImages[fileNumber] = reader.result; // Actualiza la vista previa
        this.selectedFiles[fileNumber] = file;
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  triggerFileInput(event: Event): void {
    const target = event.target as HTMLElement;
    const fileNumber = target.id.replace('icono', '').replace('image', ''); // Extrae el número (1-6)
  
    const fileInputs: { [key: string]: ElementRef<HTMLInputElement> } = {
      '1': this.fileInput1,
      '2': this.fileInput2,
      '3': this.fileInput3,
      '4': this.fileInput4,
      '5': this.fileInput5,
      '6': this.fileInput6,
    };
  
    fileInputs[fileNumber]?.nativeElement.click();
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
        { file: this.selectedFile1, key: 'imageUrl1' },
        { file: this.selectedFile2, key: 'imageUrl2' },
        { file: this.selectedFile3, key: 'imageUrl3' },
        { file: this.selectedFile4, key: 'imageUrl4' },
        { file: this.selectedFile5, key: 'imageUrl5' },
        { file: this.selectedFile6, key: 'imageUrl6' },
      ];
  
      
      for (const fileData of files) {
        if (fileData.file) {
          const formData = new FormData();
          formData.append('file', fileData.file);
  
          try {
            const urlImage = await this.uploadImage(formData);
            if (urlImage !== 'Error al subir el archivo') {
              
              (lead as any)[fileData.key] = urlImage;
            }
          } catch (error) {
            console.error(`Error asignando la URL para ${fileData.key}:`, error);
          }
        }
      }
  
      console.log(lead);
  
      // Enviar datos al servidor por WebSocket
      this.socketService.sendMessage('create-lead', { lead });
    }
  }
  
  async uploadImage(formData: FormData): Promise<string> {
    try {
      const response = await this.leadService.postUploadsLead(formData).toPromise();
      return response!.fileName; 
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      return 'Error al subir el archivo'; // Retorna el mensaje de error.
    }
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
        this.router.navigate(['/pro/get-leads'])
      }
      else{
        this.router.navigate(['/leads/list'])
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
        ? `<img src="${this.urlUploads}${professional.image}" 
                   class="rounded-circle" 
                   style="width: 80px; height: 80px; object-fit: cover; display: block; margin: 0 auto;" />`
        : `<img src="assets/avatar_profile.png" 
                   class="rounded-circle" 
                   style="width: 80px; height: 80px; object-fit: cover; display: block; margin: 0 auto;" />`}
        <span style="display: block; margin-top: 10px; font-size: 18px; font-weight: bold;">
            ${professional.fullname}
        </span>
    </div>
          <div style="margin-top: 10px;">
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
