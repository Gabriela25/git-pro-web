import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { AuthHeaders } from './auth-headers.service';
import { OrderStatus } from '../interface/order-status.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  private token:string = '';
  constructor( private authHeadersService: AuthHeaders) {
    
  }
  getAllOrderStatus(): Observable<{ orderStatus:OrderStatus[]}> {
    const headers = this.authHeadersService.getHeaders(); 
    return this._http.get<{ orderStatus:OrderStatus[]}>(`${this.apiUrlBackend}/statusorders`, headers);
  }
  
   

 
}
