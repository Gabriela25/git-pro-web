import { afterNextRender, afterRender, Component, Inject, makeStateKey, PLATFORM_ID, TransferState } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { isPlatformBrowser } from '@angular/common';
import { errorMonitor } from 'events';


@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    HeaderComponent
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent {

  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  tokenPassword: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private transferState: TransferState
  ) {

  }
  ngOnInit(): void {

    if (this.tokenPassword) {
      this.tokenPassword = this.route.snapshot.paramMap.get('id');
      localStorage.setItem('token', this.tokenPassword || '');


    }
  }
  newPasswordForm = new FormGroup({

    newPassword: new FormControl(
      '', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,15}$/)],
    ),
    confirmNewPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,15}$/)])
  }, {
    validators: this.passwordMatchValidator

  });
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const formGroup = control as FormGroup;
    const password = formGroup.get('newPassword')!.value;

    const confirmPassword = formGroup.get('confirmNewPassword')!.value;
    const controlConfirmPassword = formGroup.get('confirmNewPassword');

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
    this.isLoading = true;
    const formData = this.newPasswordForm.value;
    if (this.newPasswordForm.valid) {
      const password: any = {
        password: formData.newPassword || '',
      };
      this.authService.postNewPassword(password).subscribe({
        next: (response) => this.handleSuccessfulSubmission(response),
        error: (error) => this.handleError(error)
      });
    }

  }
  handleSuccessfulSubmission(response: any) {
    this.alertMessage = 'alert-success';
    this.backendMessage = response.message || 'New password successfully';
    this.isLoading = false;
    this.startAlertTimer();
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



