import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Service } from '../interface/service.interface';
import { AuthHeaders } from './auth-headers.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;

  constructor( private authHeadersService: AuthHeaders) {
    
  }
  getAllServices(): Observable<{ services:Service[]}> {  
    const headers = this.authHeadersService.getHeaders();
    return this._http.get<{ services:Service[]}>(`${this.apiUrlBackend}/services`, headers);
  }
  
}
