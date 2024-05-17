import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sing-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    HeaderComponent,
    
  ],
  templateUrl: './sing-in.component.html',
  styleUrl: './sing-in.component.css'
})
export default class SingInComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.loginForm.value);
  }
}

