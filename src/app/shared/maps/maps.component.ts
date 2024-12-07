import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-maps',
  standalone: true,
  imports: [
    GoogleMapsModule,
    CommonModule

  ],
  templateUrl: './maps.component.html',
  styleUrl: './maps.component.css'
})
export class MapsComponent implements OnInit {
  ngOnInit(): void {
    this.calculate();
  }
  resultb: string = '';
  resultc: string = '';
  pointA: google.maps.LatLngLiteral = { lat: -0.180653, lng: -78.467834 }; // Coordenadas de A
  pointB: google.maps.LatLngLiteral = { lat: -2.170998, lng: -79.922359 }; // Coordenadas de B
  pointC: google.maps.LatLngLiteral = { lat: -2.90055, lng: -79.00453 }; // Coordenadas de C
  radiusB: number = 300000; // Radio de B en Metros
  radiusC: number = 100000; // Radio de C en Metros
  radiusCMiles = this.convertMetersToMiles(this.radiusC)
  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: this.pointA,
    zoom: 7,
    zoomControl: true,
  };
  nzLocations: any[] = [
    this.pointA,
    this.pointB,
    this.pointC
  ];
  circleCenterB: google.maps.LatLngLiteral = this.pointB;
  circleCenterC: google.maps.LatLngLiteral = this.pointC;

  distanceB: number = this.haversineDistance(this.pointA, this.pointB);

  distanceC: number = this.haversineDistance(this.pointA, this.pointC);
  convertMetersToMiles(meters: number): number {
    return meters / 1609.34;
  }
  haversineDistance(coord1: google.maps.LatLngLiteral, coord2: google.maps.LatLngLiteral): number {
    const R = 6371e3; // Radio de la Tierra en millas
    const toRad = (x: number): number => x * Math.PI / 180; // Convertir grados a radianes

    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);
    const lat1 = toRad(coord1.lat);
    const lat2 = toRad(coord2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

   calculate()  {

    if (this.distanceB <= this.radiusB) {
      this.resultb = 'Quito está dentro de los 300km de Guayaquil'
 
    } else {
      this.resultb = 'Quito está fuera de los 300km de Guayaquil';

    }

    if (this.distanceC <= this.radiusC) {
      this.resultc += 'Quito está dentro de los '+ this.radiusC.toFixed(2)+' de Cuenca';

    } else {
      this.resultc += 'Quito fuera de los '+ this.radiusC.toFixed(2)+' de Cuenca';

    }
  }
  
  calculateRadiusMinus(){
   
    
    this.resultc = '';
    this.radiusC -= this.radiusC * 0.15;
    this.radiusCMiles = this.convertMetersToMiles(this.radiusC)
    this.calculate();
    this.options = {center: this.pointC,zoom: this.options.zoom!+1}
  
    
  }

  async calculateRadiusAdd(){
    this.resultc = '';
    this.radiusC += this.radiusC * 0.15;
    this.radiusCMiles = this.convertMetersToMiles(this.radiusC)
   
    this.calculate();
    this.options = {center: this.pointC,zoom: this.options.zoom!-1}
  }
}
