import { OrderByLead } from './../interface/lead-by-order.interface';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { AuthHeaders } from './auth-headers.service';
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
  
  constructor(
    private authService: AuthService,
    private authHeadersService: AuthHeaders ){ 
  }
  

  postOrderByLead(body: any):Observable<{orders:OrderByLead[]}>{
    const hearders = this.authHeadersService.getHeaders(); 
    return this._http.post<{orders:OrderByLead[]}>(`${this.apiUrlBackend}/leads/order`, body, hearders);
    
  }
  
   getOrderUser(page: number = 1, limit: number = 10): Observable<{
      orders: Order[];
      total: number;
      page: number;
      limit: number;
      lastPage: number;
    }> {
      const headers = this.authHeadersService.getHeaders();
  
      return this._http.get<{
        orders: Order[];
        total: number;
        page: number;
        limit: number;
        lastPage: number;
      }>(`${this.apiUrlBackend}/orders/user/`, {
        ...headers,
        params: {
          page: page.toString(),
          limit: limit.toString(),
        }
      });
    }
  
   getOrderUserCustomer(page: number = 1, limit: number = 10): Observable<{
      orders: Order[];
      total: number;
      page: number;
      limit: number;
      lastPage: number;
    }> {
      const headers = this.authHeadersService.getHeaders();
  
      return this._http.get<{
        orders: Order[];
        total: number;
        page: number;
        limit: number;
        lastPage: number;
      }>(`${this.apiUrlBackend}/orders/user/client`, {
        ...headers,
        params: {
          page: page.toString(),
          limit: limit.toString(),
        }
      });
    }
  
  getOrderDetail(id: string ):Observable<{order:Order}>{
    const hearders = this.authHeadersService.getHeaders();
    return this._http.get<{order:Order}>(`${this.apiUrlBackend}/orders/detail/${id}`,  hearders);
    
  }
  getOrderbyLeadUser(id: string ):Observable<{orders:Order[]}>{
    const hearders = this.authHeadersService.getHeaders();
    return this._http.get<{orders:Order[]}>(`${this.apiUrlBackend}/orders/lead/${id}`,  hearders);
    
  }

  updatedOrder(orderId: string, body: any):Observable<{order:Order}>{

    const headers = this.authHeadersService.getHeaders(); 
    return this._http.put<{ order:Order}>(`${this.apiUrlBackend}/orders/${orderId}`, body, headers);

  }  

}
