import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialLoginModule, SocialUser } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider } from "@abacritt/angularx-social-login";

import {  GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { RecaptchaService } from '../../services/recaptcha.service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    HeaderComponent,
    SocialLoginModule,
    GoogleSigninButtonModule,
    NgxCaptchaModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export default class RegisterComponent  implements OnInit{
  isCustomer: boolean | null = true;
  user: SocialUser = new SocialUser();
  loggedIn: boolean = false;
  recaptchaToken: string|null='';
  siteKey: string = '6LeyixEqAAAAAJYntUQr0-bDYNkfORIW3Uiabz-8'; 
  isBrowser: boolean= true;
   
  registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      isTerm : new FormControl(false, Validators.requiredTrue),
      recaptcha: new FormControl('', [Validators.required]),
      password: new FormControl(
        '', [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/)],
      ),
      confirmPassword: new FormControl('', [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/)])
    }, { validators: this.passwordMatchValidator });
  constructor(
    private route: ActivatedRoute,
    private authService: SocialAuthService,
    private _recaptcha: RecaptchaService,
    private platformService: PlatformService,
      ){
    this.isBrowser = this.platformService.isBrowser() 
    console.log(this.platformService.isBrowser() )
  }
  ngOnInit(): void {
    
    this.route.queryParamMap.subscribe((paramMap) => {
     
      const paramValue = paramMap.get('isCustomer');
      this.isCustomer = paramValue === 'true' ? true : paramValue === 'false' ? false : null;
      
    });
    this.authService.authState.subscribe((user) => {
      
      this.user = user ? user : new SocialUser();
      this.loggedIn = (user != null);
      if (this.loggedIn) {
        this.dataUser(user);
      }
    });
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
    console.warn(this.registerForm.value);
    if(this.registerForm.value.recaptcha){
      const data ={
        token : this.registerForm.value.recaptcha
      }
      this._recaptcha.getRecaptcha(data).subscribe((resp)=>{
        if(resp.message){
          console.log('procesamos el formulario')
        }
      })
    }
    //this.recaptcha.getRecaptcha(this.registerForm.value)
  }
 
  onCaptchaResolved(recaptchaToken: any) {
    console.log('en el evento')
    console.log(recaptchaToken)
    //this.http.post('/verify-recaptcha', { recaptchaToken }).subscribe(response => {
      //console.log('Backend response:', response);
   // });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  dataUser(user: SocialUser) {
    console.log(user)
    
  }
  signOut(){
    this.authService.signOut();
  }
}
