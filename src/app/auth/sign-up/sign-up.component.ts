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

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    NgxMaskDirective,
    HeaderComponent,
    CapitalizeFirstDirective,
    NoWhitespaceDirective
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
  constructor(
    private route: ActivatedRoute,
    private router: Router,

    private platformService: PlatformService,

    private authService: AuthService
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
    console.log(value)
    if(value == 'password'){
      this.showPassword = !this.showPassword;
    }
    else if(value == 'confirmPassword'){
      this.showConfirmPassword = !this.showConfirmPassword;
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
      password: new FormControl(
        '', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,15}$/)],
      ),
      confirmPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,15}$/)])
    }, { validators: this.passwordMatchValidator });
  }



  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')!.value;

    const confirmPassword = formGroup.get('confirmPassword')!.value;
    const controlConfirmPassword = formGroup.get('confirmPassword');

    if (password === confirmPassword) {

      controlConfirmPassword?.setErrors(null)
      return null;
    } else {
      controlConfirmPassword?.setErrors({ mismatch: true })
      return { mismatch: true }
    }

  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
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
      this.authService.postRegister(user).subscribe({
        next: (response) => this.handleSuccessfulSubmission(response),
        error: (error) => this.handleError(error)
      });
    }
  }
  handleSuccessfulSubmission(response: any) {

    this.isLoading = false;
    this.router.navigate(['/auth/verify-email']);
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
  signOut() {

  }

}
