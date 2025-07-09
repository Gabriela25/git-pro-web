import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthHeaders } from './auth-headers.service';
import { Review } from '../interface/review.interface';
import { Observable } from 'rxjs';
import { License } from '../interface/license.interace';


@Injectable({
  providedIn: 'root'
})

export class LicenseService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
 
  constructor(
    private authHeadersService: AuthHeaders) {
  }

  


  createLicense(body: License): Observable<{ license: License }> {
    const headers = this.authHeadersService.getHeaders();
    return this._http.post<{ license: License }>(`${this.apiUrlBackend}/licenses`, body, headers);
  }

}
