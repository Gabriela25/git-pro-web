import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

import { ActivatedRoute } from '@angular/router';
import { User } from '../interface/user.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.css'
})
export class ViewProfileComponent implements OnInit {
  urlUploads = environment.urlUploads;
  user: User = {
      id: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      profile: {
        id: '',
        profileCategories: [],
        zipcodeId: '',
        zipcodes: [],
        address: '',
        imagePersonal: '',
        introduction: '',
  
        isBusiness: false,
      },
    };
  userId: string | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.userService.getViewProfilePro(this.userId).subscribe({
        next: (response) => {
          
          this.user = response.user;
       
        },
        error: (err) => console.error(err)
      });
    }
  }

  getAverageStars(user: any): number {
  if (!user.reviewPro || user.reviewPro.length === 0) {
    return 0; // si no tiene reseñas
  }
  const total = user.reviewPro.reduce((sum: number, review: any) => sum + (review.rating || 0), 0);
  return total / user.reviewPro.length;
}
}
