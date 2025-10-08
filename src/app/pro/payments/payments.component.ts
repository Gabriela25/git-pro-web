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
import e from 'express';
import { Stripe } from '@stripe/stripe-js';
import { CheckStripeService } from '../../services/checkout-stripe.service';
import { error } from 'console';
import { firstValueFrom } from 'rxjs';

import { UserService } from '../../services/user.service';
import { ProfileCategory } from '../../interface/profile-category.interface';
import { User } from '../../interface/user.interface';

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
  errorMessage: string = '';
  paymentMethod: Array<{ key: string, value: string }> = [
    { key: 'cash', value: 'Cash' },
    { key: 'card', value: 'Credit or Debit Card' },
    { key: 'zelle', value: 'Zelle' },
    { key: 'paypal', value: 'Paypal' }
  ];
  page: number = 1;
  pageSize: number = 5;
  paymentInitiated: boolean = false;
  selectedCategoryIds: string[] = [];
  user: User = {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      profile: {
        id: '',
        profileCategories: [],
        zipcodeId: '',
        zipcodes: [],
        address: '',
        imagePersonal: '',
        introduction: '',
  
        isBusiness: false,
      },
    };
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private serviceService: ServiceService,
    private paymentService: PaymentService,
    private checkStripe: CheckStripeService,
    private userService: UserService
  ) {
    /*this.paymentForm = this.fb.group({
      serviceId: new FormControl(null, [Validators.required]),
      reference: new FormControl('', [Validators.required]),
      amount: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        this.amountValidator.bind(this) 
      ]),
    });*/
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.userService.getMe().subscribe({
      next: (response) => {
        this.user= response.user;
    
        if (this.user.profile?.profileCategories) {
          this.selectedCategoryIds = this.user.profile.profileCategories
            .filter((cat: ProfileCategory) => cat.status === 'PENDING_PAYMENT' || cat.status === 'PAYMENT_FAILED')
            .map((cat: ProfileCategory) => cat.categoryId)
            .filter((categoryId): categoryId is string => typeof categoryId === 'string') || [];
          
        }               
      },
      error: (error) => console.error(error),
    });
    this.paymentService.getMePayment().subscribe({
      next: (response) => {
        this.listPayment = response.payments.sort((a, b) => {
          return new Date(b.activationDate ?? 0).getTime() - new Date(a.activationDate ?? 0).getTime();
        });
      },
      error: (error) => this.handleError(error)
        
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

 /* onSubmit() {
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
  }*/

 
  retryPayment() {
    const profileId = this.user.profile?.id;
    if (!profileId || this.selectedCategoryIds.length === 0) return;

    this.isLoading = true;
    firstValueFrom(
      this.checkStripe.createCheckoutSession(profileId, this.selectedCategoryIds)
    )
    .then(response => {
      if (response?.checkoutStripe?.url) window.location.href = response.checkoutStripe.url;
    })
    .catch(err => this.handleError(err))
    .finally(() => this.isLoading = false);
  }

 handleSuccessfulSubmission(response: any) {
    this.isLoading = false;
    this.backendMessage = '';
    setTimeout(() => {
      this.alertMessage = 'alert-success';
      this.backendMessage = response.message || 'Payment created successfully'; 
    });
  }
  handleError(error: any) {
    this.isLoading = false;
    this.backendMessage = '';
    setTimeout(() => {
      this.alertMessage = 'alert-danger';
     this.backendMessage = error.error.message || 'An error occurred';
    });

  }
  
 
  goToCategorySelection() {
    this.currentStep = 1; 
  }
  
  
  async initiateStripeCheckout(): Promise<void> {
    const profileId = this.user.profile?.id;
    if (!profileId) {
      this.backendMessage = 'Los datos del perfil no están disponibles. No se puede iniciar el pago.';
      this.handleError({ error: { message: this.backendMessage } });
      return;
    }
    if (this.selectedCategoryIds.length === 0) {
      this.backendMessage = 'No hay categorias pendientes de pago';
      this.handleError({ error: { message: this.backendMessage } });
      return;
    }
      this.isLoading = true; // Activa el spinner de carga
      this.backendMessage = ''; // Limpia cualquier mensaje de error previo
      this.paymentInitiated = true; // Indica que el proceso de pago ha comenzado para mostrar la UI correspondiente
  
      try {
        const categoryIds = this.selectedCategoryIds; // Obtiene los IDs de las categorías seleccionadas
        if (!categoryIds || categoryIds.length === 0) {
          // Si no se ha seleccionado ninguna categoría, lanza un error y sale
          throw new Error('Selecciona al menos una categoría para continuar.');
        }
  
        // --- ESTA ES LA CORRECCIÓN CRÍTICA ---
        // Convertimos el Observable a una Promesa y esperamos a que se resuelva.
        // Opción para RxJS 7+:
        const response = await firstValueFrom(
          this.checkStripe.createCheckoutSession(profileId, categoryIds)
        );
        // O, si estás usando una versión anterior de RxJS y 'toPromise()' no está deprecado o lo tienes importado:
        // const response = await this.checkStripe.createCheckoutSession(profileId, categoryIds).toPromise();
  
        // Una vez que 'await' ha finalizado, 'response' contendrá la respuesta exitosa del backend.
        if (response && response.checkoutStripe.url) {
          window.location.href = response.checkoutStripe.url; // Redirige al usuario a la página de pago de Stripe
          // La ejecución de este método se detendrá aquí ya que el navegador cambia de página.
        } else {
          // Este bloque se ejecutaría si el backend respondiera OK, pero sin la URL esperada.
          // (Lo cual sería un error en el backend si siempre debe devolver una URL).
          this.backendMessage =
            'No se pudo obtener la URL de pago de Stripe. Por favor, intenta de nuevo.';
          this.paymentInitiated = false; // Permite que el usuario reintente el pago
        }
      } catch (error: any) {
        // Este bloque 'catch' capturará cualquier error que ocurra durante la operación asíncrona:
        // - Errores de red
        // - Errores HTTP (4xx, 5xx) devueltos por el backend
        // - Errores lanzados explícitamente, como el de "Selecciona al menos una categoría".
        console.error('Error al crear la sesión de Checkout:', error);
  
        // Intenta obtener un mensaje de error más específico de la respuesta del backend
        this.backendMessage =
          error.error?.message ||
          'Hubo un problema al iniciar el pago. Intenta más tarde.';
        this.paymentInitiated = false; // Permite que el usuario vea la opción de reintentar
      } finally {
        
        this.isLoading = false; // Desactiva el spinner
      }
    }
  }


