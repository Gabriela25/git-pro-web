import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './verify-account.component.html',
  styleUrl: './verify-account.component.css'
})
export class VerifyAccountComponent implements OnInit {

  tokenAccount: string | null = '';
  messageAccount: string = '';
  constructor(
    private route: ActivatedRoute,
    private auth: AuthService) { }

  ngOnInit(): void {
    this.tokenAccount = this.route.snapshot.paramMap.get('id');
    
    if (this.tokenAccount) {
      localStorage.setItem('token', this.tokenAccount);

      this.auth.getVerifyAccount().subscribe({
        next: (response) => {
          this.messageAccount = 'Your account has been successfully verified';
          
          
         
          
         
        },
        error: (error) => {
          this.messageAccount= "There was an error verifying the account";
          
        }
       
      });
      localStorage.removeItem('token')
    }
    
  }
}