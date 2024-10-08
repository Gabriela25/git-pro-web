
// auth.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../interface/user.interface';
import { authStatus } from '../enum/auth.enum';
import { Login } from '../interface/login.interface';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  //@Output() eventUser: EventEmitter<any> = new EventEmitter();
  private _userSubject = new BehaviorSubject<object>({});
  user$ = this._userSubject.asObservable();
  authStatus: authStatus = authStatus.checking;
  token: string = '';
  constructor(

  ) {

    this.token = localStorage.getItem('token') || '';

    if (this.isBrowser()) {
      this.token = localStorage.getItem('token') || '';

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this._userSubject.next(JSON.parse(storedUser));
      }
    }
    this.isAuthenticated();
  }


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
  postLogin(body: Login): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    return this._http.post(`${this.apiUrlBackend}/auth/login`, body, options);
  }


  getVerifyAccount() {

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    };
    return this._http.get(`${this.apiUrlBackend}/auth/verify`, options);
  }
  resetPassword(body: any): Observable<any> {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    return this._http.post(`${this.apiUrlBackend}/auth/reset-password`, body, options);
  }
  postNewPassword(body: any): Observable<any> {

    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    };


    return this._http.post(`${this.apiUrlBackend}/auth/new-password`, body, options);
  }
  isAuthenticated() {
    if (typeof window !== 'undefined') {

      this.token = localStorage.getItem('token') || '';

   
    }
    if (this.token == null || this.token === '') {
      this.authStatus = authStatus.notAuthenticated;

      return false;
    } else {
      this.authStatus = authStatus.authenticated;
      return true;
    }
  }
  updateUserName(field: string, value: any): void {

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    currentUser[field] = value;
    localStorage.setItem('user', JSON.stringify(currentUser));
    this._userSubject.next(currentUser);
  }
  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}

