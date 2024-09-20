import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ServiceService } from '../../services/service.service';
import { TranslateModule } from '@ngx-translate/core';
import { Service } from '../../interface/service.interface';
import { Payment } from '../../interface/payment.interface';
import { PaymentService } from '../../services/payment.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-get-leads',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    CommonModule, 
    HeaderComponent,
    
  ],
   providers: [DatePipe], 
  templateUrl: './get-leads.component.html',
  styleUrl: './get-leads.component.css'
})
export default class GetLeadsComponent {


  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  token: string = '';
  paymentForm!: FormGroup;

  currentStep: number = 1;
  listServices:Array<Service>= [];
  listPayment: Array<Payment> = [];

  paymentMethod: Array<{ key: string, value: string }> = [
    { key: 'cash', value: 'Cash' },
    { key: 'card', value: 'Credit or Debit Card' },
    { key: 'zelle', value: 'Zelle' },
    { key: 'paypal', value: 'Paypal' }
  ];
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private serviceService: ServiceService,
    private paymentService: PaymentService,

  ) {
    this.paymentForm = this.fb.group({
      serviceId: new FormControl([], [Validators.required]),
      reference: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
     
    });
    
  }

  ngOnInit(): void {

    this.serviceService.getAllServices().subscribe({
      next: (response) => {
       this.listServices = response.services;
  
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.paymentService.getMePayment().subscribe({
      next: (response) => {
       this.listPayment = response.payments;
       console.log(response )
      },
      error: (error) => {
        console.log(error);
      }
    });
    
  }
  
  transformDate() {
    const date = new Date('2024-09-21T11:00:00.000Z');
    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy hh:mm a');
    console.log(formattedDate); // Muestra la fecha transformada
  }
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep= step;
    
  }
  
  onSubmit() {
    this.isLoading = true;
    if(this.paymentForm.valid){
      
      const paymentMethod = 'cash';
      const status = 'pending';
      const formData = this.paymentForm.value;
      const payment: Payment = {

        serviceId: formData.serviceId ||'',
        amount: formData.amount ,
        paymentMethod: paymentMethod,
        status: status,
        reference: formData.reference || '',
        
      };
      this.paymentService.postPayment(payment).subscribe({
        next: (response) => {
          
          const message = response.message;
          this.alertMessage = 'alert-success'
          this.backendMessage = message;
          this.isLoading = false;
          this.listPayment.push(response.payment);
          this.startAlertTimer();

        },
        error: (error) => {
          console.log(error)
          this.alertMessage = 'alert-danger'
          this.backendMessage = error.error.message;
          this.isLoading = false;
          this.startAlertTimer();
        }
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
