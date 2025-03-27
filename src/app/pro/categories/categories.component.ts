import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';

import { FormComponent } from './form/form.component';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    HeaderComponent,

    FormComponent
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit{
  listCategories: Array<any> =[]
   constructor(
    private category: CategoryService,){
   }
   ngOnInit(): void {
    this.category.getAllCategories().subscribe({
      next: (response) => {
       this.listCategories = response.categories;
      },
      error: (error) => {  
       
      }
    });
    //this.listServices = this.category.getCategory();
  }
}
