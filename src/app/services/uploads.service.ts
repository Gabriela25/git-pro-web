import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { AuthHeaders } from './auth-headers.service';
import { User } from '../interface/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  

  
  constructor(
    private authService: AuthService,
    private authHeadersService :AuthHeaders
  ) { 
 
   
  }

 
  postUploads(body: FormData): Observable<{uploads:any}>{
    const token = this.authService.getToken();
    const uploadOptions = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    return this._http.post<{uploads:any}>(`${this.apiUrlBackend}/pro/uploads/`,body, uploadOptions);
  }
  /*postUploadsMulti(body: FormData): Observable<{files:any}>{
    console.log(body)
    const token = this.authService.getToken();
    const uploadOptions = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    return this._http.post<{files:any}>(`${this.apiUrlBackend}/pro/uploads/multi`,body, uploadOptions);
  }*/

  postUploadsImageAll(body: FormData): Observable<{ fileName: string }> {
    const token = this.authService.getToken();
    const uploadOptions = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
   const headers= this.authHeadersService.getHeaders();
    return this._http.post<{ fileName: string }>(`${this.apiUrlBackend}/files/uploads`, body,uploadOptions);
  }
}
