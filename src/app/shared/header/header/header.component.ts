import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private translate: TranslateService) {
    this.translate.addLangs(['es', 'en']); 
  
  }

  switchLanguage(languaje : string) {
    this.translate.use(languaje); 
  }
}
