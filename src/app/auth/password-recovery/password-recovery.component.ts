import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TextDisplayComponent } from '../../shared/text-display/text-display.component';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    TextDisplayComponent
  ],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export default class PasswordRecoveryComponent {
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  message: string = ''
  constructor(
    public router: Router,
    private authService: AuthService
  ) {

  }
  recoveryPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),

  });


  onSubmit() {
    this.recoveryPasswordForm.markAllAsTouched();
    if(this.recoveryPasswordForm.invalid){
      return;
    }
    else{
      // TODO: Use EventEmitter with form value
    this.isLoading = true;
    const formData = this.recoveryPasswordForm.value;
    const email: any = {
      email: formData.email || '',

    };

    this.authService.resetPassword(email).subscribe({
      next: (response) => {
        if (this.recoveryPasswordForm.valid) {
          this.handleSuccessfulSubmission(response)
        }
      },
      error: (error) => this.handleError(error)
    });

  }
  }
  handleSuccessfulSubmission(response: any) {
    this.isLoading = false;
    this.alertMessage = 'alert-success';
    this.message = `<h1 class="text-white">Check your email</h1>
    <p  class="text-white">  Thanks. If there's an account associated with this email address, we'll send the password reset instructions.</p>`
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

