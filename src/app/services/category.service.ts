import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


    private  listServices : Array<any>=[
      {
        "id": 1,
        "name":"Air Conditioning",
        "img": "assets/ac.png"
      },
      {
        "id": 2,
        "name":"Electrical",
        "img": "assets/electrical.png"
      },
      {
        "id": 3,
        "name":"Plumbing",
        "img": "assets/plumbing.png"
      },
      {
        "id": 4,
        "name":"Handyman",
        "img": "assets/handyman.png"
      },
      {
        "id": 5,
        "name":"Cleaning",
        "img": "assets/cleaning.png"
      },
      {
        "id": 6,
        "name":"Roofing",
        "img": "assets/roofing.png"
      },
      
  ];

  private triggerCategory = new BehaviorSubject<any>(null);
  currentCategory = this.triggerCategory.asObservable();


  constructor() { }
  
  changeCategory(data: any) {
    this.triggerCategory.next(data);
  }
  getCategory(){
    return this.listServices;
  }
}
