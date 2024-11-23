import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LeadByOrder } from '../interface/lead-by-order.interface';
import { Lead } from '../interface/lead.interface';



@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  private _orderSubject = new BehaviorSubject<object>({});
  order$ = this._orderSubject.asObservable();
  token: string = '';
  
  constructor() { 

    this.token = localStorage.getItem('token') || '';
  }


  postLeadByOrder(body: any):Observable<{leads:LeadByOrder[]}>{
   
    const options = {
      
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
    }
    return this._http.post<{leads:LeadByOrder[]}>(`${this.apiUrlBackend}/leads/order`, body, options);
    
  }
  
  getLeadUser():Observable<{leads:Lead[]}>{
    const options = {
      
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
    }
    return this._http.get<{leads:Lead[]}>(`${this.apiUrlBackend}/leads/user/`,  options);
    
  }
  
    
  getLeadDetail(id: string ):Observable<{lead:Lead}>{
    const options = {
      
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
    }
    return this._http.get<{lead:Lead}>(`${this.apiUrlBackend}/leads/detail/${id}`,  options);
    
  }

}
