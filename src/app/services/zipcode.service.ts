import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zipcode } from '../interface/zipcode.interface';
import { AuthHeaders } from './auth-headers.service';

@Injectable({
  providedIn: 'root'
})
export class ZipcodeService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  constructor( private authHeadersService: AuthHeaders) {
    
  }
  getAllZipcodes(): Observable<{zipcodes:Zipcode[]}> {
    const headers = this.authHeadersService.getHeaders()
    return this._http.get<{zipcodes:Zipcode[]}>(`${this.apiUrlBackend}/zipcodes`, headers);
  }

}
