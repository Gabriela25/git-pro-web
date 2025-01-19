import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

import { AuthHeaders } from './auth-headers.service';
import { StatusOrder } from '../interface/status-order.interface';

@Injectable({
  providedIn: 'root'
})
export class StatusOrderService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  private token:string = '';
  constructor( private authHeadersService: AuthHeaders) {
    
  }
  getAllStatusOrder(): Observable<{ statusOrder:StatusOrder[]}> {
    const headers = this.authHeadersService.getHeaders(); 
    return this._http.get<{ statusOrder:StatusOrder[]}>(`${this.apiUrlBackend}/statusorders`, headers);
  }
  
   

 
}
