import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, SocialLoginModule, SocialUser } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider } from "@abacritt/angularx-social-login";

import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { RecaptchaService } from '../../services/recaptcha.service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { PlatformService } from '../../services/platform.service';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interface/user.interface';
import { CapitalizeFirstDirective } from '../../shared/directives/capitalize-first.directive';
import { NoWhitespaceDirective } from '../../shared/directives/no-whitespace';
import { CommonModule } from '@angular/common';
import { FloatingAlertComponent } from '../../shared/floating-alert/floating-alert.component';
import { PhoneService } from '../../services/phone.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    NgxMaskDirective,
    CapitalizeFirstDirective,
    NoWhitespaceDirective,
    FloatingAlertComponent
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export default class SignUpComponent implements OnInit {
  isCustomer: boolean | null = true;
  user: SocialUser = new SocialUser();
  loggedIn: boolean = false;
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  isBrowser: boolean = true;
  signUpForm!: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isSubmitted: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private platformService: PlatformService,
    private authService: AuthService,
    private phoneService: PhoneService
  ) {
    this.initializeSignUpForm();
  }
  ngOnInit(): void {
    this.route.queryParamMap.subscribe((paramMap) => {
      const paramValue = paramMap.get('isCustomer');
      this.isCustomer = paramValue === 'true' ? true : paramValue === 'false' ? false : null;
    });
  }
  togglePasswordVisibility(value:string): void {
   
    if(value == 'password'){
      this.showPassword = !this.showPassword;
    }
    
  }
  initializeSignUpForm() {
    this.signUpForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      isTerm: new FormControl(false, [Validators.requiredTrue]),
      //recaptcha: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
    });
  }



  
  onSubmit() {
    // TODO: Use EventEmitter with form value
    this.isSubmitted = true;
    this.signUpForm.markAllAsTouched();
    if (this.signUpForm.invalid) {
      return;
    }
    else {
      this.isLoading = true;
      const formData = this.signUpForm.value;
      const user: User = {
        firstname: formData.firstName || '',
        lastname: formData.lastName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        password: formData.password || '',
        enabled: false
      };
      this.phoneService.getPhoneValidate(user.phone).subscribe({
        next: (phoneValidationResult) => {
          if (phoneValidationResult.phone.valid) {
            this.authService.postRegister(user).subscribe({
              next: (response) => this.handleSuccessfulSubmission(response),
              error: (error) => this.handleError(error)
            });
          } else {
            this.handleError({ error: { message: 'Invalid phone number' } });
            
          }
        },
        error: (error) => {
          
          this.handleError(error);
        }
      });
    }
  }
  handleSuccessfulSubmission(response: any) {

    this.isLoading = false;
    this.router.navigate(['/auth/verify-email']);
  }
  handleError(error: any) {
    this.isLoading = false;
    this.backendMessage = '';
    const message = typeof error === 'string' ? error : (error.error?.message || 'An error occurred');
    setTimeout(() => {
      this.alertMessage = 'alert-danger';
      this.backendMessage = message;
    });

    
    
  }
 
  signOut() {

  }

}
