import { environment } from './../../environments/environment.development';
import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MapsComponent } from '../shared/maps/maps.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    MapsComponent,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;

  maps_key:string = environment.MAPS_KEY;
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
  selectServices(idService : number){
    console.log(idService)
  }
}
