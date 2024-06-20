import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-electrical',
  standalone: true,
  imports: [
    HeaderComponent
  ],
  templateUrl: './electrical.component.html',
  styleUrl: './electrical.component.css'
})
export default class ElectricalComponent {

}
