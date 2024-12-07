import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHeaders {
  constructor(private authService: AuthService) {}


  public getHeaders(contentType: string = 'application/json'): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    const headersConfig: { [key: string]: string } = {
      'Content-Type': contentType,
    };

    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    return { headers: new HttpHeaders(headersConfig) };
  }
}
