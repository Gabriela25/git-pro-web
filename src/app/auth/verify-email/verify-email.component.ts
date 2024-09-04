import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export default class VerifyEmailComponent {
  constructor(){
    
  }
}
