import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { LeadRegister } from '../interface/lead-register.interface';
import { AuthHeaders } from './auth-headers.service';
import { Lead } from '../interface/lead.interface';


@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  private _leadSubject = new BehaviorSubject<object>({});
  lead$ = this._leadSubject.asObservable();
  token: string | null = null;

  constructor(
    private authHeadersService: AuthHeaders,
    private authService: AuthService) {
  }

  //lista de leads del cliente, que aun no son ordenes
  getLeads(): Observable<{ leads: Lead[] }> {
    const headers = this.authHeadersService.getHeaders();
    return this._http.get<{ leads: Lead[] }>(`${this.apiUrlBackend}/leads`, headers);

  }
  //obtiene la lista de los leads al que el usuario pro puede acceder.
  getLeadAllByPro(): Observable<{ leads: Lead[] }> {
    const headers = this.authHeadersService.getHeaders();

    return this._http.get<{ leads: Lead[] }>(`${this.apiUrlBackend}/leads/pro`,headers);
  }
  getLeadDetail(id: string): Observable<{ lead: Lead }> {
    const headers = this.authHeadersService.getHeaders();
    return this._http.get<{ lead: Lead }>(`${this.apiUrlBackend}/leads/${id}`, headers);

  }
  updateDataLead(field: string, value: any): void {

    const currentRequest = JSON.parse(localStorage.getItem('lead') || '{}');
    currentRequest[field] = value;
    localStorage.setItem('lead', JSON.stringify(currentRequest));
    this._leadSubject.next(currentRequest);
  }

  postLead(body: LeadRegister): Observable<{ lead: LeadRegister }> {
    const headers = this.authHeadersService.getHeaders();
    return this._http.post<{ lead: LeadRegister }>(`${this.apiUrlBackend}/leads`, body, headers);
  }


  postUploadsLead(body: FormData): Observable<{ fileName: string }> {
    const token = this.authService.getToken();
    const uploadOptions = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    return this._http.post<{ fileName: string }>(`${this.apiUrlBackend}/pro/uploads/all/`, body, uploadOptions);
  }


}