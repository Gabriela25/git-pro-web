import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { ContainerComponent } from '../../shared/container/container.component';

@Component({
  selector: 'app-phone',
  standalone: true,
  imports: [
    HeaderComponent,
    ContainerComponent
  ],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.css'
})
export default class PhoneComponent {
  label: string = 'Phone';
  idElement: string = 'phone';
  routerLink: string = '/service-request/descripcion-service';
}
