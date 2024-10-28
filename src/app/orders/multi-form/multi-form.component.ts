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

@Component({
  selector: 'app-multi-form',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    NgxMaskDirective
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
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private categoriesServices: CategoryService,
    private zipCodeService: ZipcodeService,
    private orderService: OrderService,
    private uploadsService: UploadsService,
  ){
    this.orderForm = this.fb.group({
      zipcode: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      description: new FormControl('',[Validators.required, Validators.minLength(10)]),
    });
  }
  
  ngOnInit(){
    this.zipCodeService.getAllZipcodes().subscribe({
      next: (response) =>  this.listZipcode = response.zipcodes,
      error: (error) => console.log(error)
    });
    this.categoriesServices.getAllCategories().subscribe({
      next: (response) =>  this.listCategories = response.categories,
      error: (error) => console.log(error)
    });
    this.orderService.order$.subscribe((data: any) => {
      this.categoryName = data.categoryName;
      this.categoryId = data.categoryId;
    }); 
  }
  onSelectionCategory(){
  
    this.orderService.updateDataOrder('categoryId',this.selectedOption.id);
    this.orderService.updateDataOrder('categoryName', this.selectedOption.name );
  }
  step(step:number){
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
    if(this.orderForm.value.zipcode){
     
      this.zipcodeName = this.orderForm.value.zipcode.name;
    }
    if(this.orderForm.value.phone){
     
      this.phone = this.orderForm.value.phone;
    }
    if(this.orderForm.value.description){
     
      this.description = this.orderForm.value.phone.substring(0,10)+ ' '+'...';
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
    if(this.orderForm.valid){
      this.isLoading = true
      console.log(this.orderForm.value)
      const formData = this.orderForm.value;
      const order: Order = {
        categoryId: this.categoryId,
        zipcodeId: formData.zipcode.id,
        phone: formData.phone,
        description: formData.description,
        
      };
      this.orderService.postOrder(order).subscribe({
        next: (response) => {
          
          this.alertMessage = 'alert-success'
          this.backendMessage = 'Order created success';

          this.isLoading = false;
         
          if (this.selectedFile) {
            this.isLoading = true;
            const formData = new FormData();
            formData.append('model', 'order');
            formData.append('idModel', response.order.id!);
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
            });


          }
         
          this.startAlertTimer(() => {
         
            
          });
        },
        error: (error) => {
          this.alertMessage = 'alert-danger'
          this.backendMessage = error.error.message;
          this.isLoading = false;
          this.startAlertTimer();
        }
      });
    }
    
  }
  startAlertTimer(redirectCallback?: () => void) {
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.orderForm.reset();
      this.currentStep = 0
      this.phone = '';
      this.description= '';
      this.zipcodeName = '';
      this.backendMessage = '';
      this.router.navigate(['/']);
      
      if (redirectCallback) {
        redirectCallback();
      }
    }, 3000); 
  }
}
