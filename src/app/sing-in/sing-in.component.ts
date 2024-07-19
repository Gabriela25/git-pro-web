import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';

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
  message:String = '';
  users= [
    {
      "email": "gabrielabarreto25@gmail.com",
      "password":"Gabi1234",
      "rol":"pro"

    },
    {
      "email": "flaviaperezbarreto@gmail.com",
      "password":"Flavia1234",
      "rol":"customer"

    },
  ]
  emailLogin:String = 'gabrielabarreto25@gmail.com'
  passwordLogin: String = 'Gabi1234'

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(public router: Router){
    
  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    //console.warn(this.loginForm.value);
    const user = this.users.find((x)=> x.email=== this.loginForm.value.email)
    if(user === undefined){
      this.message = 'User no fount'
    }else{
      if(user.password != this.loginForm.value.password){
        this.message = 'Password does not match'
      }else{
        if(user.rol==='customer'){
          this.message='customer'
          this.router.navigate(['/list']);
        }else{
          this.message='pro'
          this.router.navigate(['pro/profile'])
        }
      }
    }
  }
}

