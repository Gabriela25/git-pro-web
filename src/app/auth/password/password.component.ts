import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../shared/header/header.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    HeaderComponent
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export default class PasswordComponent {
  passwordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl(
      '', [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/)],
      
    ),
    confirmNewPassword: new FormControl('', [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/)])
  }, { validators: this.passwordMatchValidator });

  
  
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const formGroup = control as FormGroup;
    const newPassword = formGroup.get('newPassword')!.value;

    const confirmNewPassword = formGroup.get('confirmNewPassword')!.value;
    const controlNewPassword = formGroup.get('confirmNewPassword');
   
    if(newPassword === confirmNewPassword ){
 
      controlNewPassword?.setErrors(null)
      return null;
    }else{
     
     
      controlNewPassword?.setErrors( { mismatch: true })
      return { mismatch: true }
    }
    
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.passwordForm.value);
  }
}
