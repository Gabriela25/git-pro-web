import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Service } from '../interface/service.interface';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;

  constructor() {
    
  }
  getAllServices(): Observable<{ services:Service[]}> {
    
    const options = {
      
      headers: {
        'Content-Type': 'application/json',

      },

    };
    return this._http.get<{ services:Service[]}>(`${this.apiUrlBackend}/services`, options);
  }
  
}
