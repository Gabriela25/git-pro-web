import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { authStatus } from '../../enum/auth.enum';
import { ModalComponent } from '../modal/modal.component';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { Modal } from 'bootstrap';
import { User } from '../../interface/user.interface';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    ModalComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  idSignLog: boolean = false;
  isAuthenticated: boolean = false;
  nameUser: string = '';
  emailUser: string = '';
  imagePersonal: string = '';
  selectedFile: File | null = null;
  previewImg: string | ArrayBuffer | null = null;
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  token: string = '';
  isOpen: boolean = false;
  isOnline: boolean = true;
  isPro: boolean = false;
  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('profilePicModal') profilePicModal!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('closebutton') closeButton!: ElementRef;
  constructor(
    private http: HttpClient,
    private trans: TranslateService,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.trans.addLangs(['es', 'en']);
    this.isAuthenticated = this.authService.isAuthenticated()
    console.log(this.isAuthenticated)
  }
  ngOnInit() {
    this.authService.user$.subscribe((data: any) => {
      if (data) {
        this.nameUser = data.name;
        this.emailUser = data.email; 
        if (data.imagePersonal) {
          this.imagePersonal = data.imagePersonal; 
        }
        this.isOnline = data.available; 
        this.isPro = data.isPro || false; 
      }
    });
  }



  toggleOnlineStatus(): void {
    this.isOnline = !this.isOnline;
    console.log(this.isOnline)
    const user: User = {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      profile: {
        categories: [],
        zipcodeId: '',
        address: '',
        imagePersonal: '',
        introduction: '',
        isBusiness: false,
        available: this.isOnline
      }
    };

    this.userService.putMe(user).subscribe({
      next: (response) => {
        console.log(response)

      },
      error: (error) => {

      }
    });


  }
  switchLanguage(languaje: string) {
    this.trans.use(languaje);
  }
  /*openModal() {
    this.modal.open();
  }*/
  signOut() {
    this.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.authService.authStatus = authStatus.notAuthenticated;
  }

  

  
  close() {

    this.closeButton.nativeElement.click();
  }
  startAlertTimer() {
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.backendMessage = '';
    }, 3000);
  }

}
