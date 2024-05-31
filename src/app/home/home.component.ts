import { environment } from './../../environments/environment.development';
import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MapsComponent } from '../shared/maps/maps.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    MapsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;

  maps_key:string = environment.MAPS_KEY;
  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: { lat: -31, lng: 147 },
    zoom: 4,
  };
  
}
