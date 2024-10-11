import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Order } from '../interface/order.interface';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  
  token: string = '';
  
  constructor() { 

    this.token = localStorage.getItem('token') || '';
  }

 
  postUploads(body: FormData): Observable<{message:string}>{
    
    const uploadOptions = {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };
    return this._http.post<{message:string}>(`${this.apiUrlBackend}/pro/uploads/`,body, uploadOptions);
  }
  
}
