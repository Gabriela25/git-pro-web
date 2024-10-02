import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule
   
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css'
})
export class ContainerComponent {

  @Input() label: string ='';
  @Input() idElement: string ='';
  @Input() routerLink: string= '';
  
}
