import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../interface/user.interface';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { Auth } from '../interface/auth.interface';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    HeaderComponent,
    
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export default class AuthComponent {
 
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  token: string= '';
  
  constructor(
    public router: Router,
    private authService:  AuthService,
    private location: Location,
    private userService: UserService
  ){
    
  }
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required,Validators.minLength(6)]),
  });
  
 
  onSubmit() {
      // TODO: Use EventEmitter with form value
      this.isLoading = true; 
      const formData = this.loginForm.value;
      
      const auth: Auth = {
        email: formData.email || '',   
        password: formData.password || '',
       
      };
      this.authService.postLogin(auth).subscribe({
        next: (response) => {
          /*this.alertMessage = 'alert-success'
          this.backendMessage = response.message; */
          
          this.isLoading = false; 
          this.token = response.token;
          localStorage.setItem('token', this.token);
          this.authService.updateUserName('name', `${response.user.firstname} ${response.user.lastname}`);
          this.authService.updateUserName('email', `${response.user.email}`,);
          this.userService.getMe().subscribe({
            next: (response) => {
              if (response.user.profile?.imagePersonal != null) {  
                this.authService.updateUserName('imagePersonal', `${response.user.profile.imagePersonal}` );
              }
            },
            error: (error) => {
              console.log(error);
            }
        });
          
        this.router.navigate(['/']);

        },
        error: (error) => {  
          this.alertMessage = 'alert-danger'
          this.backendMessage = error.error.message; 
          this.isLoading = false; 
          this.startAlertTimer();
        }
      });
      /*if(this.registerForm.value.recaptcha){
        const data ={
          token : this.registerForm.value.recaptcha
        }
        this._recaptcha.getRecaptcha(data).subscribe((resp)=>{
          if(resp.message){
            console.log('procesamos el formulario') 
            //this.authService.postRegister()
          }
        })
      }*/
      //this.recaptcha.getRecaptcha(this.registerForm.value)
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

