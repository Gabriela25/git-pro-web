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

  currentStep: number = 0;
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
  previewImg1: string | ArrayBuffer | null = null;
  previewImg2: string | ArrayBuffer | null = null;
  previewImg3: string | ArrayBuffer | null = null;
  previewImg4: string | ArrayBuffer | null = null;
  previewImg5: string | ArrayBuffer | null = null;
  previewImg6: string | ArrayBuffer | null = null;
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
  urlUploads: string = environment.urlUploads || '';

  title: string = 'Lead';
  messageLead!: SafeHtml | string;
  isOpenModal: boolean = false;

  leadId: string = '';
  phoneUser: string = '';
  isPro: boolean= false;
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
      category: new FormControl('', [Validators.required]),
      zipcode: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      imageUrl1: new FormControl(''),
      imageUrl2: new FormControl(''),
      imageUrl3: new FormControl(''),
      imageUrl4: new FormControl(''),
      imageUrl5: new FormControl(''),
      imageUrl6: new FormControl('')
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
        this.listCategories = response.categories
        //asignamos el valor inicial de la categoría
        this.selectedOption = this.listCategories.find(
          (item) => item.id === this.categoryId
        );
      },
      error: (error) => console.log(error)
    });
    this.socketService.getMessage('lead-created').subscribe((msg: any) => {
      this.onCreatedLead(msg);
    });

    this.socketService.getMessage('lead-accepted').subscribe(this.onAcceptedLead.bind(this));
    this.checkUser();
  }
  checkUser(){
    this.userService.getMe().subscribe({
      next: (response) => {
        this.phoneUser = response.user.phone  
        this.leadForm.get('phone')?.setValue(this.phoneUser);
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
      this.leadForm.get('phone')?.setValue('');
    }
    else{
      this.leadForm.get('phone')?.setValue(this.phoneUser);  
    }
  }
  onSelectionCategory() {
    const category = this.leadForm.get('category')?.value
  
    this.leadService.updateDataLead('categoryId', category.id);
    this.leadService.updateDataLead('categoryName', category.name);
  }
  step(step: number) {
    if (step > this.currentStep) {

      if (this.currentStep === 0 && !this.leadForm.controls['zipcode'].valid) {
        return;
      }
      if (this.currentStep === 1 && !this.leadForm.controls['phone'].valid) {
        return;
      }
    }

    this.currentStep = step;

  }
  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
    if (this.leadForm.value.zipcode) {
      this.zipcodeName = this.leadForm.value.zipcode.name;
    }
    if (this.leadForm.value.phone) {
      this.phone = this.leadForm.value.phone;
    }
    if (this.leadForm.value.description) {
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
    const fileNumber = input.id.substring(9)
    console.log(input.id)
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          switch (fileNumber){
            case '1': this.previewImg1 = e.target.result;
                      this.selectedFile1 = file;
                    break;
            case '2': this.previewImg2 = e.target.result;
                      this.selectedFile2 = file;
                    break;
            case '3': this.previewImg3 = e.target.result;
                      this.selectedFile3 = file;
                    break;
            case '4': this.previewImg4 = e.target.result;
                      this.selectedFile4 = file;
                    break;
            case '5': this.previewImg5 = e.target.result;
                      this.selectedFile5 = file;
                    break;
            case '6': this.previewImg6 = e.target.result;
                      this.selectedFile6 = file;
                      break;
            
          }
          
        }
      };
      reader.readAsDataURL(file);
    }
  }
  triggerFileInput(event:any): void {
    console.log(event.target)
    const numero = event.target?.id.substring(5)
    console.log(numero)
    switch(numero){
      case '1': 
        this.fileInput1.nativeElement.click();
      break;
      case '2': 
        this.fileInput2.nativeElement.click();
      break;
      case '3': 
        this.fileInput3.nativeElement.click();
      break;
      case '4': 
        this.fileInput4.nativeElement.click();
      break;
      case '5': 
        this.fileInput5.nativeElement.click();
      break;
      case '6': 
        this.fileInput6.nativeElement.click();
      break;
    }
   
   
  }
  async onSubmit() {
    this.leadForm.markAllAsTouched();
  
    if (this.leadForm.valid) {
      this.isLoading = true;
  
      const formLead = this.leadForm.value;
      const lead: LeadRegister = {
        categoryId: this.categoryId,
        zipcodeId: formLead.zipcode.id,
        phone: formLead.phone,
        description: formLead.description,
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
