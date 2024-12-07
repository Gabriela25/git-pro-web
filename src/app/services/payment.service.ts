import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Payment } from '../interface/payment.interface';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthHeaders } from './auth-headers.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
 
  token: string ='';
  constructor(
     private authService: AuthService,
     private authHeadersService: AuthHeaders,
  ) {
   
   
  }
  
  
  getMePayment(): Observable<{payments:Payment[]}>{
    const headers = this.authHeadersService.getHeaders();
    return this._http.get<{payments:Payment[]}>(`${this.apiUrlBackend}/payments`, headers);
  }
  postPayment(body:Payment): Observable<{payment:Payment,message:string}>{
    const headers = this.authHeadersService.getHeaders();
    return this._http.post<{payment:Payment,message:string}>(`${this.apiUrlBackend}/payments`,body, headers);
  }
}
