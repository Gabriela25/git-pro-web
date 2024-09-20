import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Payment } from '../interface/payment.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  options = {} 
  token: string ='';
  constructor() {
    this.token = localStorage.getItem('token') || '';
    this.options = {
      
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
  }
  
  }
  getMePayment(): Observable<{payments:Payment[]}>{
   
    return this._http.get<{payments:Payment[]}>(`${this.apiUrlBackend}/payments`, this.options);
  }
  postPayment(body:Payment): Observable<{payment:Payment,message:string}>{
   
    return this._http.post<{payment:Payment,message:string}>(`${this.apiUrlBackend}/payments`,body, this.options);
  }
}
