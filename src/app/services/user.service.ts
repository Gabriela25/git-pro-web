import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interface/user.interface';
import { Profile } from '../interface/profile.interface';
import { AuthService } from './auth.service';
import { AuthHeaders } from './auth-headers.service';
import { Image } from '../interface/image.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
 
  private _userSubject = new BehaviorSubject<object>({});
  user$ = this._userSubject.asObservable();

  constructor( 
    private authHeadersService: AuthHeaders,
    private authService: AuthService
  ) {}
  
  becomeToPro(body: Profile): Observable<any> {
   //const headers= this.authHeadersService.getHeaders()
   const token = this.authService.getToken();
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    return this._http.post(`${this.apiUrlBackend}/users/become-to-pro`, body,options);
  }
  getMe(): Observable<{user:User}>{
    const headers= this.authHeadersService.getHeaders();
    return this._http.get<{user:User}>(`${this.apiUrlBackend}/users/me`,{...headers});
  }
  putMe(body:User): Observable<{user:User}>{
    const headers= this.authHeadersService.getHeaders();
    //const headers= this.authHeadersService.getHeaders();
    return this._http.put<{user:User}>(`${this.apiUrlBackend}/users/me`,body, {...headers});
  }
  postLicenses(body:any): Observable<{images:Image[]}>{
    const headers= this.authHeadersService.getHeaders();

    return this._http.post<{images:Image[]}>(`${this.apiUrlBackend}/users/licenses`,body, {...headers});
  }
  deletedLicenses(imageId:string): Observable<{message:string}>{
    const headers= this.authHeadersService.getHeaders();

    return this._http.delete<{message:string}>(`${this.apiUrlBackend}/users/licenses/${imageId}`, {...headers});
  }
  getLicense(profileId:string): Observable<{images:Image[]}>{
    const headers= this.authHeadersService.getHeaders();
    return this._http.get<{images:Image[]}>(`${this.apiUrlBackend}/users/licenses/${profileId}`, {...headers});
  }

}
 

