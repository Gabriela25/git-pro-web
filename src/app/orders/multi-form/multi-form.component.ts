import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ZipcodeService } from '../../services/zipcode.service';
import { Zipcode } from '../../interface/zipcode.interface';
import { OrderService } from '../../services/order.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { Order } from '../../interface/order.interface';
import { Router } from '@angular/router';
import { UploadsService } from '../../services/uploads.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../interface/category.interface';
import { SocketService } from '../../services/socket.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from '../../../environments/environment.development';


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
  orderForm: FormGroup;
  selectedFile: File | null = null;
  previewImg: string | ArrayBuffer | null = null;
  selectedOption: any;
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;

  isSelected = false;
  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  urlUploads: string = environment.urlUploads || '';

  title: string = 'Order';
  messageOrder!: SafeHtml | string;
  isOpenModal: boolean = false;
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private categoriesServices: CategoryService,
    private zipCodeService: ZipcodeService,
    private orderService: OrderService,
    private uploadsService: UploadsService,
    private socketService: SocketService,
  ) {
    this.orderForm = this.fb.group({
      zipcode: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      images: new FormControl('')
    });
  }

  ngOnInit() {
    this.orderService.order$.subscribe((data: any) => {
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
    this.socketService.getMessage('order-created').subscribe((msg: any) => {
      this.onCreatedOrder(msg);
    });

    this.socketService.getMessage('order-accepted').subscribe(this.onAcceptedOrder.bind(this));

  }

  onSelectionCategory() {
    this.orderService.updateDataOrder('categoryId', this.selectedOption.id);
    this.orderService.updateDataOrder('categoryName', this.selectedOption.name);
  }
  step(step: number) {
    if (step > this.currentStep) {

      if (this.currentStep === 0 && !this.orderForm.controls['zipcode'].valid) {
        return;
      }
      if (this.currentStep === 1 && !this.orderForm.controls['phone'].valid) {
        return;
      }
    }

    this.currentStep = step;

  }
  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
    if (this.orderForm.value.zipcode) {

      this.zipcodeName = this.orderForm.value.zipcode.name;
    }
    if (this.orderForm.value.phone) {

      this.phone = this.orderForm.value.phone;
    }
    if (this.orderForm.value.description) {

      this.description = this.orderForm.value.phone.substring(0, 10) + ' ' + '...';
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
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
  onSubmit() {
    if (this.orderForm.valid) {
      this.isLoading = true

      const formOrder = this.orderForm.value;
      const formData = new FormData();
      const order: Order = {
        categoryId: this.categoryId,
        zipcodeId: formOrder.zipcode.id,
        phone: formOrder.phone,
        description: formOrder.description,
        images: '',
        statusOrder: '',
      };
      if (this.selectedFile) {
        formData.append('file', this.selectedFile)
        this.orderService.postUploadsOrder(formData).subscribe({
          next: (response) => {

            order.images = response.fileName;
            this.socketService.sendMessage('create-order', { order });
          },
          error: (error) => {
            console.error('Error al subir el archivo:', error);
          },
        });
      }

      // peticion a un websocket
      this.socketService.sendMessage('create-order', { order });
    }

  }
  startAlertTimer() {
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.closeModal();
    }, 3000);
  }
  onCreatedOrder(payload: unknown) {
    console.log('onCreatedOrder2', payload)

    //if (this.selectedFile) {

    if (!payload) {
      return;
    }

    if (typeof payload !== 'object') {
      return;
    }

    if (!('orders' in payload)) {
      return;
    }

    const { orders } = payload as { orders: Order };;

    //this.isLoading = false;
    /*if (this.selectedFile) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('model', 'order');
      formData.append('idModel', order.id!);
      formData.append('field', 'images');
      formData.append('file', this.selectedFile);
    
      this.uploadsService.postUploads(formData).subscribe({
        next: (response) => {
          console.log(response)

        },
        error: (error) => {
          console.log(error)
        }
      });


    }*/
    this.messageOrder = this.sanitizer.bypassSecurityTrustHtml(`
        <div>
          <p>Seraching professionals...</p> 
        </div>
        <div class="d-flex justify-content-center mt-3">
            <div class="spinner-border" role="status">
            </div>
        </div>
     `);
    this.openModal()
    // this.startAlertTimer()
    /*const formData = new FormData();
    formData.append('model', 'order');
    formData.append('idModel', order.id!);
    formData.append('field', 'images');
    formData.append('file', this.selectedFile);
  
    this.uploadsService.postUploads(formData).subscribe({
      next: (response) => {
        console.log(response)

      },
      error: (error) => {
        this.alertMessage = 'alert-danger'
        this.backendMessage = error.error.message;
        this.isLoading = false;
        this.startAlertTimer();
      }
    });*/


    //}
  }
  closeModal() {
    this.modal.close();
    this.isOpenModal = false;
  }
  openModal() {
    this.isLoading = false;
    this.modal.open();
    this.isOpenModal = true;

  }


  onAcceptedOrder(payload: unknown) {

    console.log({ payload });

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
    this.messageOrder = this.sanitizer.bypassSecurityTrustHtml(`
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
    // Lógica después de confirmar la acción
  }
}
