import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Order } from '../interface/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  private _orderSubject = new BehaviorSubject<object>({});
  order$ = this._orderSubject.asObservable();
  token: string = '';
  
  constructor() { 

    this.token = localStorage.getItem('token') || '';
  }

  updateDataOrder(field: string, value: any): void {

    const currentRequest = JSON.parse(localStorage.getItem('order') || '{}');
    currentRequest[field] = value;
    localStorage.setItem('order', JSON.stringify(currentRequest));
    this._orderSubject.next(currentRequest);
  }

  postOrder(body:Order):Observable<{order:Order}>{
    const uploadOptions = {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };
    
    return this._http.post<{order:Order}>(`${this.apiUrlBackend}/orders`,body, uploadOptions);
  }
  postUploads(body: FormData): Observable<{order:Order}>{
    
    const uploadOptions = {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };
    return this._http.post<{order:Order}>(`${this.apiUrlBackend}/pro/uploads/`,body, uploadOptions);
  }
  
}
