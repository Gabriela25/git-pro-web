import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private trans: TranslateService) {
    this.trans.addLangs(['es', 'en']); 
  
  }

  switchLanguage(languaje : string) {
    this.trans.use(languaje); 
  }
}
