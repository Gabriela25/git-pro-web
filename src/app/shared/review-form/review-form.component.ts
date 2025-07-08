import { Component, inject, Input, signal } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Order } from '../../interface/order.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Review } from '../../interface/review.interface';
import { FloatingAlertComponent } from "../floating-alert/floating-alert.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FloatingAlertComponent,
],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css'
})

export class ReviewFormComponent {
  @Input({ required: true }) order!: Order;
  @Input() orderId!: string;
  @Input() proId!: string;
  @Input() clientId!: string;
  private authService = inject(AuthService);
  private reviewService = inject(ReviewService);

  rating = signal(0);
  comment = signal('');
  loading = signal(false);
  stars = [1, 2, 3, 4, 5];
  review!: Review;
  hasReview: boolean = false;
  isLoading: boolean = false;
  backendMessage: string = '';
  alertMessage: string = '';
  ngOnInit(): void {

    if (this.orderId && this.proId && this.clientId) {
      console.log('Fetching review for orderId:', this.orderId, 'proId:', this.proId, 'clientId:', this.clientId);
      this.reviewService.getReview(this.orderId, this.proId, this.clientId).subscribe({
        
        next: (response) => {
          console.log('Review fetched successfully:', response);
          this.review = response.review;
          this.hasReview = true;
          //this.handleSuccessfulSubmission(response)
        },
        error: () => {
          this.hasReview = false;
        }
      });
    }
  }
  /*get canReview() {
    return this.order?.orderStatus?.name === 'Completed' && !this.order.review;
  }*/

hovered = 0;

getRatingLabel(value: number): string {
  switch (value) {
    case 1: return 'Muy mala';
    case 2: return 'Mala';
    case 3: return 'Regular';
    case 4: return 'Buena';
    case 5: return 'Excelente';
    default: return '';
  }
}

  setRating(value: number) {
    this.rating.set(value);
  }

  submitReview() {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.handleError;
      return;
    }

    this.loading.set(true);

    const payload = {
      orderId: this.order.id,
      rating: this.rating(),
      comment: this.comment(),
      clientId: this.clientId,
      order: this.order,
      proId: this.order.userId,
    };

    this.reviewService.createReview(payload).subscribe({
      next: (response) => {
        this.handleSuccessfulSubmission(response);
        this.review = response.review;
        this.hasReview = true;
        
      },
      error: (err) => {
        this.loading.set(false);
        this.handleError(err);
        console.error(err);
      }
    });
  }

  handleSuccessfulSubmission(response: any) {
    this.backendMessage = '';
    setTimeout(() => {
      this.alertMessage = 'alert-success';
      this.backendMessage = response.message || 'Review created successfully';
    },3000);
  }
  handleError(error: any) {
    this.backendMessage = '';
    setTimeout(() => {
      this.alertMessage = 'alert-danger';
      this.backendMessage = error.error.message || 'An error occurred';
    },3000);
  }
}



