import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-pro',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent
],
  templateUrl: './pro.component.html',
  styleUrl: './pro.component.css'
})
export class ProComponent {

}
