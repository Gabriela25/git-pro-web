import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ServiceService } from '../../services/service.service';
import { TranslateModule } from '@ngx-translate/core';
import { Service } from '../../interface/service.interface';
import { Payment } from '../../interface/payment.interface';
import { PaymentService } from '../../services/payment.service';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FloatingAlertComponent } from '../../shared/floating-alert/floating-alert.component';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    CommonModule, 
    NgxPaginationModule,
    HeaderComponent,
    FloatingAlertComponent
  ],
  providers: [DatePipe], 
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export default class PaymentsComponent {
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  token: string = '';
  paymentForm!: FormGroup;

  currentStep: number = 1;
  listServices: Array<Service> = [];
  listPayment: Array<Payment> = [];
  weeks: number = 0;
  remainingAmount: number = 0;
  formattedAmount: string = '';
  price: number = 0;
  nameService: string = '';

  paymentMethod: Array<{ key: string, value: string }> = [
    { key: 'cash', value: 'Cash' },
    { key: 'card', value: 'Credit or Debit Card' },
    { key: 'zelle', value: 'Zelle' },
    { key: 'paypal', value: 'Paypal' }
  ];
  page: number = 1;
  pageSize: number = 5;
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private serviceService: ServiceService,
    private paymentService: PaymentService,
  ) {
    this.paymentForm = this.fb.group({
      serviceId: new FormControl(null, [Validators.required]),
      reference: new FormControl('', [Validators.required]),
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        this.amountValidator.bind(this) 
      ]),
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.serviceService.getAllServices().subscribe({
      next: (response) => this.listServices = response.services,
      error: (error) => console.error(error)
    });
    this.paymentService.getMePayment().subscribe({
      next: (response) => {
        this.listPayment = response.payments.sort((a, b) => {
          return new Date(b.activationDate ?? 0).getTime() - new Date(a.activationDate ?? 0).getTime();
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep = step;  
  }

  onSubmit() {
    this.isLoading = true;
    if (this.paymentForm.valid) {
      const paymentMethod = 'cash';
      const status = 'pending';
      const formData = this.paymentForm.value;

      const payment: Payment = {
        serviceId: formData.serviceId.id || '',
        amount: formData.amount,
        paymentMethod: paymentMethod,
        status: status,
        reference: formData.reference || '',
      };
      this.paymentService.postPayment(payment).subscribe({
        next: (response) => {
          console.log(response)
          this.handleSuccessfulSubmission(response);
          this.paymentService.getMePayment().subscribe({
            next: (response) => {
              this.listPayment = response.payments.sort((a, b) => {
                return new Date(b.activationDate ?? 0).getTime() - new Date(a.activationDate ?? 0).getTime();
              });
            },
            error: (error) => {
              console.log(error);
            }
          });
          
        },
        error: (error) => this.handleError(error)
      });
    }
  }
  
  calculateWeek() {
    if (this.paymentForm.value.serviceId != null) {
      this.price = this.paymentForm.value.serviceId.price;
      this.nameService = this.paymentForm.value.serviceId.name;
      const amount = this.paymentForm.value.amount;
      if (amount) {
        this.weeks = Math.floor(amount / this.price); 
        this.remainingAmount = amount % this.price; 
        this.formattedAmount = new Intl.NumberFormat('en-EN', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(this.remainingAmount);
      }
     
    }
  }

  onService() {
    this.calculateWeek();
  }

  amountValidator(control: any) {
    const amount = parseFloat(control.value);
  
    if (this.price === undefined || this.price === null) {
      console.warn("Precio no definido");
      return null;
    }
    if(isNaN(amount)){
      return { notANumber: true }; 
    }
    if (typeof amount === 'number' && amount < this.price) {

      return { amountInvalid: true }; 
    }
    
    
    return null; 
  }

 

  handleSuccessfulSubmission(response: any) {
    this.alertMessage = 'alert-success';
    this.backendMessage = response.message || 'Profile updated successfully';
    this.isLoading = false;
   
  }

  handleError(error: any) {
    this.alertMessage = 'alert-danger';
    this.backendMessage = error.error.message || 'An error occurred';
    this.isLoading = false;
   
  }

  
}
