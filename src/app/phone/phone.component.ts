import { AfterViewInit, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../services/category.service';


import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment.development';
import firebase from 'firebase/compat/app';
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
export class PhoneComponent implements OnInit, AfterViewInit {
  recaptchaVerifier: any; 
  phoneCustomer: number = 0;
  isValidPhoneCustomer: boolean= false;
  //recaptchaVerifier?: firebase.auth.RecaptchaVerifier;

  
  constructor(
    private route: ActivatedRoute,
    
    
  ){
  
  }
  ngOnInit(): void {
    initializeApp(environment.firebaseConfig)
 
  }
  ngAfterViewInit(): void {
    try {
    const auth = getAuth();
    
    this.recaptchaVerifier= new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response:any) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        // ...
      }
    });
  } catch (error) {
    console.error('Error initializing reCAPTCHA', error);
  }
  }
 
  phoneNumber: string = '';
  verificationCode: string = '';

  async sendVerificationCode() {
    const auth = getAuth();
    const phoneNumber = '+593' + this.phoneNumber; 
    const appVerifier = this.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
    } catch (error) {
      console.error('Error sending verification code:', error);
      // Handle error appropriately
    }
  }

  async verifyCode() {
    // ... Use the stored confirmationResult to verify the code
  }
 
 
  onSubmit() {
    // TODO: Use EventEmitter with form value
    
    this.isValidPhoneCustomer = true;
    this.onValuePhone(this.isValidPhoneCustomer)
  }
 
  @Output() isPhoneOut = new EventEmitter<any>();

  onValuePhone(value: boolean) {
    
    this.isPhoneOut.emit(value);
  }
  
}

