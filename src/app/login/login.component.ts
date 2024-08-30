import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../interface/user.interface';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { Auth } from '../interface/auth.interface';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    HeaderComponent,
    
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class SingInComponent {
 
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  token: string= '';
  
  constructor(
    public router: Router,
    private authService:  AuthService,
    private location: Location
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
      const auth: Auth = {
        email: formData.email || '',   
        password: formData.password || '',
       
      };
      this.authService.postLogin(auth).subscribe({
        next: (response) => {
          /*this.alertMessage = 'alert-success'
          this.backendMessage = response.message; */
          console.log(response)
          this.isLoading = false; 
          this.token = response.token;
          //this.authService.eventUser.emit({data:`${response.user.firstname} ${response.user.lastname}`});
          this.authService.updateUserName({name:`${response.user.firstname} ${response.user.lastname}`,
                                           email: `${response.user.email}`,
          });
        
          console.log('esperando token')
          console.log(this.token )
          localStorage.setItem('token', this.token);
          this.router.navigate(['/']);
          
          //this.startAlertTimer();
          
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

