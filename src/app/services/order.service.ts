import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Order } from '../interface/order.interface';
import { OrderList } from '../interface/order-list.interface';

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


  getOrders():Observable<{orders:OrderList[]}>{
   
    const options = {
      
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
    }
    return this._http.get<{orders:OrderList[]}>(`${this.apiUrlBackend}/orders`, options);
    
  }
  postOrderByPro(body:any){
    const options = {
      
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
    }
    return this._http.post<{orders:OrderList[]}>(`${this.apiUrlBackend}/orders/pro`, options);
  }
  getOrderDetail(id:string):Observable<{order:OrderList}>{
   
    const options = {
      
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
    }
    return this._http.get<{order:OrderList}>(`${this.apiUrlBackend}/orders/${id}`, options);
    
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

  
  postUploadsOrder(body: FormData): Observable<{ fileName: string }> {
    const uploadOptions = {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };
    return this._http.post<{fileName:string}>(`${this.apiUrlBackend}/pro/uploads/order/`,body, uploadOptions);
  }


}
