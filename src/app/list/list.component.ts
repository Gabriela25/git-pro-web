import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
   HeaderComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  listServices : Array<any>=[
    {
      "id": 1,
      "name":"Electrical",
      "img": "assets/electrical.jpg"
    },
    {
      "id": 2,
      "name":"Plumbing",
      "img": "assets/plumbing.jpg"
    },
    {
      "id": 3,
      "name":"Remodeling",
      "img": "assets/electrical.jpg"
    },
    {
      "id": 4,
      "name":"Handyman",
      "img": "assets/plumbing.jpg"
    },
    
  ]
}
