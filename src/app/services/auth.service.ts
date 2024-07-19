// auth.service.ts
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: AngularFireAuth) {}

  public initializeRecaptcha(containerId: string): void {
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier(auth,containerId, {
      'size': 'normal',
      'callback': (response: any) => {
        console.log('reCAPTCHA solved, allow signInWithPhoneNumber.');
      },
    }, );
    window.recaptchaVerifier.render();
  }
}

