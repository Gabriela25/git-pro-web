import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../interface/category.interface';
import { AuthHeaders } from './auth-headers.service';
import { Payment } from '../interface/payment.interface';
import { CheckoutStripe } from '../interface/checkout-stripe.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckStripeService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;

  constructor( private authHeadersService: AuthHeaders, private authService: AuthService) { }
    
  

  createCheckoutSession(profileId: string, categoryIds: string[]): Observable<{ checkoutStripe: CheckoutStripe }> {
     const token = this.authService.getToken();
    const uploadOptions = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    return this._http.post<{checkoutStripe: CheckoutStripe }>(`${this.apiUrlBackend}/checkout-stripe`, { profileId, categoryIds },  uploadOptions );
  }
    

 
}
