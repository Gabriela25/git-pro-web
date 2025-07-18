import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../environments/environment.development';
import { ActivatedRoute, Router } from '@angular/router';
import { Payment } from '../../interface/payment.interface';
import { CheckStripeService } from '../../services/checkout-stripe.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-payment',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './category-payment.component.html',
  styleUrl: './category-payment.component.css'
})




export class CategoryPaymentComponent implements OnInit {


  profileId: string | null = null;
  categoryIdsToPay: string[] = []; // Array de IDs de categorías a pagar
  isLoading: boolean = true;
  errorMessage: string | null = null;
  paymentInitiated: boolean = false; // Para evitar múltiples inicios de pago

  constructor(
    private route: ActivatedRoute, // Para acceder a los parámetros de la URL
    private router: Router, // Para navegar a otras rutas
    private checkoutStripe: CheckStripeService){}

  ngOnInit(): void {

    this.profileId = 'tu_profile_id_ejemplo';

    this.route.queryParams.subscribe(params => {
      const idsParam = params['categoryIds'];
      if (idsParam) {
        this.categoryIdsToPay = idsParam.split(',');
      }


      if (this.profileId && this.categoryIdsToPay.length > 0 && !this.paymentInitiated) {
        this.initiateStripeCheckout();
      } else if (this.categoryIdsToPay.length === 0) {
        this.errorMessage = 'No se han seleccionado categorías para pagar.';
        this.isLoading = false;
      }
    });
  }

   async initiateStripeCheckout(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = null;
    this.paymentInitiated = true;

    this.checkoutStripe.createCheckoutSession(this.profileId!, this.categoryIdsToPay).subscribe({
      next: (data) => {
        console.log('Sesión de pago creada:', data);
        /*loadStripe(environment.stripePublishableKey).then((stripeL: Stripe | null) => {
          // Use stripeL here
        });*/
      },
      error: (error) => {
        this.errorMessage = 'Error al iniciar el pago. Por favor, inténtalo de nuevo más tarde.';
        console.error('Error al crear la sesión de pago:', error);
      },
    });

  }

  retryPayment(): void {
    this.paymentInitiated = false; 
    this.initiateStripeCheckout();
  }

 
  goToCategorySelection(): void {
    this.router.navigate(['/profile/edit']); // O la ruta a tu selección de categorías
  }

}