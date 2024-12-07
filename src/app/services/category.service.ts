import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Category } from '../interface/category.interface';
import { AuthHeaders } from './auth-headers.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  private token:string = '';
  constructor( private authHeadersService: AuthHeaders) {
    
  }
  getAllCategories(): Observable<{ categories:Category[]}> {
    const headers = this.authHeadersService.getHeaders(); 
    return this._http.get<{ categories:Category[]}>(`${this.apiUrlBackend}/categories`, headers);
  }
  
    

 
}
