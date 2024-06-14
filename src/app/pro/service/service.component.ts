import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FormComponent
  ],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css'
})
export class ServiceComponent {

}
