import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../interface/user.interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { TranslateModule } from '@ngx-translate/core';
import { Review } from '../interface/review.interface';
import { HeaderComponent } from "../shared/header/header.component";
import { FooterComponent } from "../shared/footer/footer.component";

@Component({
  selector: 'app-all-pro',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    HeaderComponent,
    FooterComponent
],
  templateUrl: './all-pro.component.html',
  styleUrl: './all-pro.component.css'
})
export class AllProComponent {
  urlUploads = environment.urlUploads;
  users: Array<User> = [];
  stars = [1, 2, 3, 4, 5];
  review: Array<Review> = [];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllPro().subscribe({
      next: (response) => {
        console.log(response.users)
        this.users = response.users;
        

        //console.log('All pro users fetched successfully:', this.users);
      },
      error: (error) => {
        console.error('Error fetching all pro users:', error);
      }
    });
  }

  getAverageStars(user: any): number {
    if (!user.reviewPro || user.reviewPro.length === 0) return 0;
    const sum = user.reviewPro.reduce((acc: number, review: any) => acc + (review.rating || 0), 0);
    return sum / user.reviewPro.length;
  }

}
