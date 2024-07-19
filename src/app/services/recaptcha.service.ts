import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {

  constructor() { }

  private readonly _http = inject(HttpClient);

  getRecaptcha(body: any): //String{
  Observable<any> {

    const options = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    //return 'holea';
    return this._http.post('http://localhost:3001/api/recaptcha', body, options);
  }
}
