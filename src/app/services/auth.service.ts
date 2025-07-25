import {  HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../interface/user.interface';
import { authStatus } from '../enum/auth.enum';
import { Login } from '../interface/login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrlBackend = environment.apiUrlBackend;
 
  authStatus: authStatus = authStatus.checking;

  private _userSubject = new BehaviorSubject<any>(null); 
  user$ = this._userSubject.asObservable();


  private readonly TOKEN_KEY = 'token'; 
  
  constructor(private _http: HttpClient) {
    this.isAuthenticated(); 
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this._userSubject.next(JSON.parse(storedUser)); 
    }

   
  }
  
  getToken(): string | null {
    
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
   
  }

  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);

  }
  getCurrentUser(): any | null {
    return this._userSubject.value;
  }
  
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      this.authStatus = authStatus.notAuthenticated;
      return false;
    } else {
      this.authStatus = authStatus.authenticated;
      return true;
    }
  }


  


  getVerifyAccount(): Observable<any> {
    const token = this.getToken();

    if (!token) {
      return throwError(() => new Error('Token not found'))
    }
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this._http.get(`${this.apiUrlBackend}/auth/verify`, options)
      .pipe(
        catchError((error) => {
          console.error('Error verifying account', error);
          return throwError(() => new Error('Error verifying account'))
        })
      );
  }


  postRegister(body: User): Observable<any> {
    return this._http.post(`${this.apiUrlBackend}/auth/register`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


  postLogin(body: Login): Observable<any> {
    return this._http.post(`${this.apiUrlBackend}/auth/login`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


  resetPassword(body: any): Observable<any> {
    return this._http.post(`${this.apiUrlBackend}/auth/reset-password`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

 
  postNewPassword(body: any): Observable<any> {
    const token = localStorage.getItem('tokenResetPassword')
    if (!token) {
      return throwError(() => new Error('Token not found'))
    }

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    return this._http.post(`${this.apiUrlBackend}/auth/new-password`, body, options)
      .pipe(
        catchError((error) => {
          console.error('Error setting new password', error);
          return throwError(() => new Error('Error setting new password'))
        })
      );
  }

  updateUser(field: string, value: any): void {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
    if (field === 'user') {
    
      Object.assign(currentUser, value); 
    } else {
    
      currentUser[field] = value;
    }
  
    localStorage.setItem('user', JSON.stringify(currentUser));
    this._userSubject.next(currentUser);
  }

  logout(): void {
    this.clearToken(); 
    localStorage.removeItem('user'); 
    this.authStatus = authStatus.notAuthenticated; 
  }
}
