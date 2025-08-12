import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../interface/category.interface';
import { AuthHeaders } from './auth-headers.service';
import { Payment } from '../interface/payment.interface';
import { CheckoutStripe } from '../interface/checkout-stripe.interface';
import { AuthService } from './auth.service';
import { Profile } from '../interface/profile.interface';
import { ProfileCategory } from '../interface/profile-category.interface';

@Injectable({
  providedIn: 'root'
})
export class CheckStripeService {
  
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;

  constructor(private authService: AuthService, private authHeadersService: AuthHeaders) { }


  createCheckoutSession(profileId: string, categoryIds: string[]): Observable<{ checkoutStripe: CheckoutStripe }> {
     const token = this.authService.getToken();
    const uploadOptions = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    return this._http.post<{checkoutStripe: CheckoutStripe }>(`${this.apiUrlBackend}/checkout-stripe`, { profileId, categoryIds },  uploadOptions );
  }

  cancelSubscription(stripeSubscriptionId: string): Observable<{ profileCategory: ProfileCategory }> {
     const headers = this.authHeadersService.getHeaders(); 
     console.log(headers);
    return this._http.put<{ profileCategory: ProfileCategory }>(`${this.apiUrlBackend}/checkout-stripe/cancel-subscription/${stripeSubscriptionId}`, {},headers );
  }
  reactiveSubscription(stripeSubscriptionId: string) {
    const headers = this.authHeadersService.getHeaders();
    return this._http.put<{ profileCategory: ProfileCategory }>(`${this.apiUrlBackend}/checkout-stripe/reactive-subscription/${stripeSubscriptionId}`, {}, headers);
  }

  newSubscriptionByCategoryExists(profileCategoryId: string): Observable<{ checkoutStripe: CheckoutStripe }> {
    const token = this.authService.getToken();
    const uploadOptions = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    return this._http.post<{ checkoutStripe: CheckoutStripe }>(`${this.apiUrlBackend}/checkout-stripe/new-subscription/${profileCategoryId}`, { }, uploadOptions);
  }
}
