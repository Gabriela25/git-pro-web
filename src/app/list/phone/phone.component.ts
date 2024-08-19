import { AfterViewInit, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';



import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment.development';
@Component({
  selector: 'app-phone',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.css'
})
export class PhoneComponent {
  window: any; 
  phoneCustomer: number = 0;
  isValidPhoneCustomer: boolean= false;
  phoneCustomerForm = new FormGroup({
    phoneCustomer: new FormControl('', [Validators.required]),

  });

  
  constructor(
    private route: ActivatedRoute){
  
  }
 
 
  phoneNumber: string = '';
  verificationCode: string = '';

  

 
 
 
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

