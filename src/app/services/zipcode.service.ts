import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zipcode } from '../interface/zipcode.interface';

@Injectable({
  providedIn: 'root'
})
export class ZipcodeService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  constructor() {
    
  }
  getAllZipcodes(): Observable<{zipcodes:Zipcode[]}> {
    const options = {  
      headers: {
       'Content-Type': 'application/json',     
      }
    };
    return this._http.get<{zipcodes:Zipcode[]}>(`${this.apiUrlBackend}/zipcodes`, options);
  }

}
