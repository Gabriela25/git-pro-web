import { AfterViewInit, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';

import { getAuth , RecaptchaVerifier} from "firebase/auth";
import { WINDOW } from './window.token'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-phone',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.css'
})
export class PhoneComponent  implements OnInit{
  phoneCustomer: number = 0;
  isValidPhoneCustomer: boolean= false;
  phoneCustomerForm = new FormGroup({
    phoneCustomer: new FormControl('', [Validators.required]),

  });

  
  constructor(
    private route: ActivatedRoute,
    
    
  ){

  }
  ngOnInit(): void {}

 
 
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.phoneCustomerForm.value.phoneCustomer);
    this.isValidPhoneCustomer = true;
    this.onValuePhone(this.isValidPhoneCustomer)
  }
 
  @Output() isPhoneOut = new EventEmitter<any>();

  onValuePhone(value: boolean) {
    
    this.isPhoneOut.emit(value);
  }
  
}

