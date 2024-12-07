import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { GeocodingService } from '../../services/geocoding.service';
import { ComunicationService } from '../../services/comunication.service';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: 
  [
    GoogleMapsModule
  ],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
  @ViewChild('searchInput', { static: false }) searchElementRef!: ElementRef;
  direccion: string| undefined ='';
  center: google.maps.LatLngLiteral = { lat: 32.774961057402194, lng: -96.80725954388643 }; // Default center (New York City)
 
  zoom = 12;

  markerPosition: google.maps.LatLngLiteral | null = this.center;
  markerOptions: google.maps.MarkerOptions = { draggable: true };
  constructor(
    private ngZone: NgZone,
    private geocodingService: GeocodingService,
    private comunication: ComunicationService
  ) {}

  ngOnInit(): void {
    this.getAddress(this.center.lat, this.center.lng )
  }

  ngAfterViewInit(): void {
    if (this.isBrowser()) {
      if ((window as any).google) {
        this.initializeAutocomplete();
      } else {
        window.addEventListener('load', () => this.initializeAutocomplete());
      }
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private initializeAutocomplete(): void {
    const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
      types: ['address'],
      //componentRestrictions: { country: 'US' }
    });

    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        const place: google.maps.places.PlaceResult = autocomplete.getPlace();

        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        // Update the center and marker position
        this.center = {
          lat: place.geometry.location!.lat(),
          lng: place.geometry.location!.lng()
        };
        this.markerPosition = this.center;
        this.direccion = place['formatted_address'];
        this.comunication.changeData(this.direccion )
   
      });
    });
  }
  updatePosition(event: google.maps.MapMouseEvent): void {
    if (event.latLng != null) {
      this.markerPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
   
      this.getAddress(this.markerPosition.lat,this.markerPosition.lng)
    }
  }
  getAddress(lat: number, lng: number): void {
    this.geocodingService.getAddressSev(lat, lng).subscribe(
      (data) => {
        if (data.status === 'OK') {
          
          this.direccion = data.results[0].formatted_address;
          this.comunication.changeData(this.direccion )
        } else {
          this.direccion = 'No se encontró la dirección';
        }
      },
      (error) => {
        console.error('Error al obtener la dirección:', error);
        this.direccion = 'Error al obtener la dirección';
      }
    );
  }
}