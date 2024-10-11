import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { ContainerComponent } from '../../shared/container/container.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interface/order.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-description',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    HeaderComponent,
    ContainerComponent,

  ],
  templateUrl: './order-description.component.html',
  styleUrl: './order-description.component.css'
})
export default class OrderDescriptionComponent {
  label: string = 'Order description';
  idElement: string = 'orderDescription';
  //routerLink: string = '/orders/order-description';
  selectedFile: File | null = null;
  previewImg: string | ArrayBuffer | null = null;
  categoryName: string = '';
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  descriptionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    
    private orderService: OrderService,
  ){
    this.descriptionForm = this.fb.group({
      description: new FormControl('', [Validators.required]),
     
    });
  }
  ngOnInit(){
    this.orderService.order$.subscribe((data: any) => {
      this.categoryName = data.categoryName
      
    }); 
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
    if(this.descriptionForm.valid){
      
      
      this.orderService.order$.subscribe((data: any) => {    
        const order: Order = {
          categoryId: '',
          zipcodeId: data.zipcode,
          phone:  data.phone,
          description:  '',
          images: ''
        };
        this.orderService.postOrder(order).subscribe({
          next: (response) => {
            this.alertMessage = 'alert-success'
            this.backendMessage = 'Profile updated success';
  
            this.isLoading = false;
            this.startAlertTimer();
          },
          error: (error) => {
            this.alertMessage = 'alert-danger'
            this.backendMessage = error.error.message;
            this.isLoading = false;
            this.startAlertTimer();
          }
        });
        console.log(data)
      });

      
    }
  }

  startAlertTimer() {
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.backendMessage = '';
    }, 3000);
  }
}
