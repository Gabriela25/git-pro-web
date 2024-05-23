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
  idSignLog:boolean= true;
  firtsName: String = "Gabriela"
  constructor(private trans: TranslateService) {
    this.trans.addLangs(['es', 'en']); 
  
  }

  switchLanguage(languaje : string) {
    this.trans.use(languaje); 
  }
}
