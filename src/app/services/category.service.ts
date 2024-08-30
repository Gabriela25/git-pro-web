import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Category } from '../interface/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  private token:string = '';
  constructor() {
    
  }
  getAllCategories(): Observable<{ categories:Category[]}> {
    /*if (typeof window !== 'undefined') {
      
      this.token = localStorage.getItem('token') || ''; 
    }*/
    const options = {
      
      headers: {
        'Content-Type': 'application/json',

      },

    };
    return this._http.get<{ categories:Category[]}>(`${this.apiUrlBackend}/categories`, options);
  }
  
    

  //private triggerCategory = new BehaviorSubject<any>(null);
  //currentCategory = this.triggerCategory.asObservable();


  //constructor() { }
  
  /*changeCategory(data: any) {
    this.triggerCategory.next(data);
  }
  getCategory(){
    return this.listServices;
  }*/
}
