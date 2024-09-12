import { Component, NgZone, OnInit } from '@angular/core';
import { GoogleMapsModule, MapGeocoder } from '@angular/google-maps';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { AutocompleteComponent } from '../../../shared/autocomplete/autocomplete.component';
import { ComunicationService } from '../../../services/comunication.service';
import { outputToObservable } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-address',
  standalone: true,
  imports: [
    GoogleMapsModule,
    SidebarComponent,
    HeaderComponent,
    AutocompleteComponent
   
  ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export default class AddressComponent  implements OnInit {
  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: { lat: 33.24860137305134, lng: -96.966622984637181 },
    zoom: 6,
  };

  pointA: google.maps.LatLngLiteral ={ lat: 33.24860137305134, lng: -96.966622984637181 }; // Coordenadas de A



  nzLocations: any[] = [
    this.pointA,
   
  ];
 
  constructor(private comunication: ComunicationService) {
    
  }
  direction: string ='';
  ngOnInit(){
    console.log('entre en direccion')
    this.comunication.currentData.subscribe(direction => {
      this.direction = direction;
    //this.comunication.triggerDirection().pipe(catchError(() => EMPTY)
    })
  }
  
}
