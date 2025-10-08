import { OrderByLead } from './../interface/lead-by-order.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { AuthHeaders } from './auth-headers.service';
import { Order } from '../interface/order.interface';
import { PhoneValidationResult } from '../interface/phone-validation-result.interface';




@Injectable({
  providedIn: 'root'
})
export class PhoneService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  
  
  constructor(
    
    private authHeadersService: AuthHeaders ){ 
  }
  

  getPhoneValidate(phone: string):Observable<{phone: PhoneValidationResult}>{
    const headers = this.authHeadersService.getHeaders(); 
    return this._http.get<{phone: PhoneValidationResult}>(`${this.apiUrlBackend}/phone/validate/${phone}`, { ...headers });
  }
  
   

}
