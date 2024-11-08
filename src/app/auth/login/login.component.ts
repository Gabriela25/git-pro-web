import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../interface/user.interface';
import { AuthService } from '../../services/auth.service';
import { Location } from '@angular/common';
import { Login } from '../../interface/login.interface';
import { UserService } from '../../services/user.service';
import { SocketComponent } from '../../shared/socket/socket.component';
import { SocketService } from '../../services/socket.service';
import { NoWhitespaceDirective } from '../../shared/directives/no-whitespace';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    HeaderComponent,
    NoWhitespaceDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  token: string = '';
  showPassword: boolean = false;
  constructor(
    public router: Router,
    private authService: AuthService,
    private location: Location,
    private userService: UserService,
    private socketService: SocketService,
  ) {

  }
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }
    else {
      this.isLoading = true;
      const formData = this.loginForm.value;

      const auth: Login = {
        email: formData.email || '',
        password: formData.password || '',
      };

      this.authService.postLogin(auth).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.token = response.token;
          localStorage.setItem('token', this.token);

          // peticion a un websocket
          this.socketService.sendMessage('auth', {});

          const userData = {
            name: `${response.user.firstname} ${response.user.lastname}`,
            email: response.user.email,
            imagePersonal: response.user.profile?.imagePersonal || null,
            isPro: !!response.user.profile?.id,
            available: response.user.profile?.available || false
          };
      
          this.userService.getMe().subscribe({
            next: (userResponse) => {
              const profile = userResponse.user.profile;

              if (profile?.id != null) {
                userData.isPro = true;
              }
              if (profile?.imagePersonal) {
                userData.imagePersonal = profile.imagePersonal;
              }
              userData.available = profile?.available || false;

              localStorage.setItem('user', JSON.stringify(userData));

              this.authService.updateUser('user', userData);
            },
            error: (error) => console.log(error)
          });

          this.router.navigate(['/']);
        },
        error: (error) => this.handleError(error)
      });
    }
  
  }


  handleError(error: any) {
    this.alertMessage = 'alert-danger';
    this.backendMessage = error.error.message || 'An error occurred';
    this.isLoading = false;
    this.startAlertTimer();
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