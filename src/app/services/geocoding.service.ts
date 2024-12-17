import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private apiKey: string = environment.MAPS_KEY
  
  private apiUrl: string = `https://maps.googleapis.com/maps/api/geocode/json?key=${this.apiKey}`;
  constructor(private http: HttpClient) { }

  getAddressSev(latitud: number, longitud: number): Observable<any> {
    const url = `${this.apiUrl}&latlng=${latitud},${longitud}`;

    
    return this.http.get<any>(url);
  }
}
