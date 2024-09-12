import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialLoginModule, SocialUser } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider } from "@abacritt/angularx-social-login";

import {  GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { RecaptchaService } from '../../services/recaptcha.service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { PlatformService } from '../../services/platform.service';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interface/user.interface';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    HeaderComponent,
    SocialLoginModule,
    GoogleSigninButtonModule,
    NgxCaptchaModule,
    NgxMaskDirective
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export default class SingInComponent  implements OnInit{
  isCustomer: boolean | null = true;
  user: SocialUser = new SocialUser();
  loggedIn: boolean = false;
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  //recaptchaToken: string|null='';
  //siteKey: string = '6Lem3hsqAAAAAAsAG7jDfkCvssYtibGVCiSzTo5P'; 
  isBrowser: boolean= true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    //private socialService: SocialAuthService,
    //private _recaptcha: RecaptchaService,
    private platformService: PlatformService,

    private authService:  AuthService
      ){
    this.isBrowser = this.platformService.isBrowser() 
    console.log(this.platformService.isBrowser() )
  }
  registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required,Validators.min(10)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      isTerm : new FormControl(false, Validators.requiredTrue),
      //recaptcha: new FormControl('', [Validators.required]),
      password: new FormControl(
        '', [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,15}$/)],
      ),
      confirmPassword: new FormControl('', [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,15}$/)])
    }, { validators: this.passwordMatchValidator });
  
  ngOnInit(): void {
    
    this.route.queryParamMap.subscribe((paramMap) => {
     
      const paramValue = paramMap.get('isCustomer');
      this.isCustomer = paramValue === 'true' ? true : paramValue === 'false' ? false : null;
      
    });
    /*this.socialService.authState.subscribe((user) => {
      
      this.user = user ? user : new SocialUser();
      this.loggedIn = (user != null);
      if (this.loggedIn) {
        this.dataUser(user);
      }
    });*/
    /*this.registerForm.controls['recaptcha'].valueChanges.subscribe(value => {
      this.recaptchaToken = value;
    });*/
  }
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')!.value;

    const confirmPassword = formGroup.get('confirmPassword')!.value;
    const controlConfirmPassword = formGroup.get('confirmPassword');
    
    if(password === confirmPassword ){
 
      controlConfirmPassword?.setErrors(null)
      return null;
    }else{
     
     
      controlConfirmPassword?.setErrors( { mismatch: true })
      return { mismatch: true }
    }
    
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.isLoading = true; 
    const formData = this.registerForm.value;
    const user: User = {
      firstname:formData.firstName || '',
      lastname: formData.lastName || '',
      email: formData.email || '',
      phone: formData.phone || '',
      password: formData.password || '',
      enabled: false
    };
    this.authService.postRegister(user).subscribe({
      next: (response) => {
        /*this.alertMessage = 'alert-success'
        this.backendMessage = response.message; */
        this.isLoading = false; 
        this.router.navigate(['/auth/verify-email']);
        //this.startAlertTimer();
      },
      error: (error) => {
        console.log(error)
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
 
  onCaptchaResolved(recaptchaToken: any) {
   
    console.log(recaptchaToken)
    //this.http.post('/verify-recaptcha', { recaptchaToken }).subscribe(response => {
      //console.log('Backend response:', response);
   // });
  }

  signInWithGoogle(): void {
   // this.socialService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  dataUser(user: SocialUser) {
    console.log(user)
    
  }
  signOut(){
    //this.socialService.signOut();
  }
}
