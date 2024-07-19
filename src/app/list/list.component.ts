import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { ZipCodeComponent } from './zip-code/zip-code.component';
import { CategoryService } from '../services/category.service';
import { PhoneComponent } from './phone/phone.component';
import { DescriptionComponent } from "./description/description.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    HeaderComponent,
    ZipCodeComponent,
    PhoneComponent,
    DescriptionComponent
],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  nameCategory: String = '';
  isValidZipCode: boolean= false;
  isValidPhoneCustomer: boolean= false;
  isValidDescription: boolean= false;
  constructor(private router: Router,) {
    
  }
  onValueZip(event:boolean){
    console.log(event)
    this.isValidZipCode= event
  }
  onValuePhoneCustomer(event:boolean){
    console.log(event)
    this.isValidPhoneCustomer= event
  }
  onValueDescription(event:boolean){
    console.log(event)
    this.isValidDescription= event
   
  }
}
