import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { authStatus } from '../../enum/auth.enum';
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
export class HeaderComponent implements OnInit  {
  idSignLog:boolean= false;
  firtsName: String = "Gabriela"
  isAuthenticated: boolean = false;
  nameUser:string = '';
  emailUser: string ='';
  constructor(
    private trans: TranslateService,
    private cd: ChangeDetectorRef,
    private auth: AuthService
  ) {
    this.trans.addLangs(['es', 'en']); 
    this.isAuthenticated = this.auth.isAuthenticated()
    console.log( this.isAuthenticated)
    
  }

  switchLanguage(languaje : string) {
    this.trans.use(languaje); 
  }

  signOut(){
    //temporal

    this.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    //this.auth._userSubject.next({});
    this.auth.authStatus = authStatus.notAuthenticated;
  }
  ngOnInit(){
    /*this.auth.eventUser.subscribe(data=>{
      console.log(data.data)
      console.log('**************')
      this.nameUser= data.data;
      this.cd.detectChanges();
    })*/
      this.auth.user$.subscribe((data: any) => {

        this.nameUser = data.name;
        this.emailUser = data.email;
      });
  }
}
