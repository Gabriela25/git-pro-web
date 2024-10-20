import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interface/user.interface';
import { Profile } from '../interface/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
 
  private _userSubject = new BehaviorSubject<object>({});
  user$ = this._userSubject.asObservable();

  token: string ='';
  options = {} 
  constructor(

  ) {
    
     
       
      this.token = localStorage.getItem('token') || '';
     
      this.options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      };
  
    
  }
  
  becomeToPro(body: Profile): Observable<any> {
    
    return this._http.post(`${this.apiUrlBackend}/users/become-to-pro`, body, this.options);
  }
  getMe(): Observable<{user:User}>{
    //pendiente revision
    this.token = localStorage.getItem('token') || '';
     
      this.options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      };
    return this._http.get<{user:User}>(`${this.apiUrlBackend}/users/me`, this.options);
  }
  putMe(body:User): Observable<{user:User}>{
    console.log(body)
    return this._http.put<{user:User}>(`${this.apiUrlBackend}/users/me`,body, this.options);
  }
  postUploads(fileData: FormData,  field: string): Observable<{user:User}>{
    
    const uploadOptions = {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    };
    return this._http.post<{user:User}>(`${this.apiUrlBackend}/pro/uploads/${field}`,fileData, uploadOptions);
  }
  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
