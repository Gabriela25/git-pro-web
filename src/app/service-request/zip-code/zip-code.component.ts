import { Component } from '@angular/core';
import { ContainerComponent } from '../../shared/container/container.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-zip-code',
  standalone: true,
  imports: [
    ContainerComponent,
    HeaderComponent
  ],
  templateUrl: './zip-code.component.html',
  styleUrl: './zip-code.component.css'
})
export default class ZipCodeComponent {
  nameCategory: string = "";
  label: string = 'Zipcode';
  idElement: string = 'zipcode';
  routerLink: string = '/service-request/phone';
  
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
  
      this.nameCategory = params['name'];

    });
  }

}
