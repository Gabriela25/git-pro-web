import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../interface/user.interface';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    HeaderComponent,
    
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export default class SingInComponent {
 
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  constructor(
    public router: Router,
    private authService:  AuthService
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
      console.log(formData)
      const user: User = {
       
        email: formData.email || '',
        
        password: formData.password || '',
       
      };
      this.authService.postLogin(user).subscribe({
        next: (response) => {
          this.alertMessage = 'alert-success'
          this.backendMessage = response.message; 
          this.isLoading = false; 
          this.startAlertTimer();
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

