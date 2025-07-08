import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthHeaders } from './auth-headers.service';
import { Review } from '../interface/review.interface';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ReviewService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
 
  constructor(
    private authHeadersService: AuthHeaders) {
  }

  
  getReview(orderId: string, proId: string, clientId: string): Observable<any> {
  const { headers } = this.authHeadersService.getHeaders();
  return this._http.get<{ review: Review }>(`${this.apiUrlBackend}/reviews/review`, {
    params: {
      orderId,
      proId,
      clientId
    },
    headers
  });
}

  createReview(body: Review): Observable<{ review: Review }> {
    const headers = this.authHeadersService.getHeaders();
    return this._http.post<{ review: Review }>(`${this.apiUrlBackend}/reviews`, body, headers);
  }

}
