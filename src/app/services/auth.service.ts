// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import {User} from'../interface/user.interface';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    //private afAuth: AngularFireAuth
  ) {}
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  
  /*public initializeRecaptcha(containerId: string): void {
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier(auth,containerId, {
      'size': 'normal',
      'callback': (response: any) => {
        console.log('reCAPTCHA solved, allow signInWithPhoneNumber.');
      },
    }, );
    window.recaptchaVerifier.render();
  }*/

  postRegister(body: User): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    return this._http.post(`${this.apiUrlBackend}/auth/register`, body, options);
  }
  postLogin(body: User): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    return this._http.post(`${this.apiUrlBackend}/auth/login`, body, options);
  }
}

