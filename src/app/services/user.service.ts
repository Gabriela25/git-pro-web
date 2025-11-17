import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../interface/user.interface';
import { Profile } from '../interface/profile.interface';
import { AuthHeaders } from './auth-headers.service';
import { Image } from '../interface/image.interface';
import { ProfileReq } from '../interface/profile-req.interface';
import { UserReq } from '../interface/user-req.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;

  private _userSubject = new BehaviorSubject<object>({});
  user$ = this._userSubject.asObservable();

  constructor(private authHeadersService: AuthHeaders) {}

  becomeToPro(
    body: ProfileReq
  ): Observable<{ profile: Profile; message: string }> {
    const headers = this.authHeadersService.getHeaders();
    return this._http.post<{ profile: Profile; message: string }>(
      `${this.apiUrlBackend}/users/become-to-pro`,
      body,
      headers
    );
  }

  getMe(): Observable<{ user: User }> {
    const headers = this.authHeadersService.getHeaders();
    return this._http.get<{ user: User }>(`${this.apiUrlBackend}/users/me`, {
      ...headers,
    });
  }

  getAllPro(
    page: number = 1,
    limit: number = 10
  ): Observable<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  }> {
    const headers = this.authHeadersService.getHeaders();

    return this._http.get<{
      users: User[];
      total: number;
      page: number;
      limit: number;
      lastPage: number;
    }>(`${this.apiUrlBackend}/users/all-pro`, {
      ...headers,
      params: {
        page: page.toString(),
        limit: limit.toString(),
      },
    });
  }

  getViewProfilePro(
    userId: string
  ): Observable<{ user: User }> {
    const headers = this.authHeadersService.getHeaders();
    return this._http.get<{ user: User }>(
      `${this.apiUrlBackend}/users/view-pro/${userId}`,
      { ...headers }
    );
  }
  updateMe(body: UserReq): Observable<{ user: User; message: string }> {
    console.log('Updating user with data:', body);
    const headers = this.authHeadersService.getHeaders();
    return this._http.put<{ user: User; message: string }>(
      `${this.apiUrlBackend}/users/me`,
      body,
      { ...headers }
    );
  }

  getLicense(profileId: string): Observable<{ images: Image[] }> {
    const headers = this.authHeadersService.getHeaders();
    return this._http.get<{ images: Image[] }>(
      `${this.apiUrlBackend}/users/licenses/${profileId}`,
      { ...headers }
    );
  }
  postLicenses(body: any): Observable<{ images: Image[]; message: string }> {
    const headers = this.authHeadersService.getHeaders();
    return this._http.post<{ images: Image[]; message: string }>(
      `${this.apiUrlBackend}/users/licenses`,
      body,
      { ...headers }
    );
  }

  deletedLicenses(imageId: string): Observable<{ message: string }> {
    const headers = this.authHeadersService.getHeaders();
    return this._http.delete<{ message: string }>(
      `${this.apiUrlBackend}/users/licenses/${imageId}`,
      { ...headers }
    );
  }
}
