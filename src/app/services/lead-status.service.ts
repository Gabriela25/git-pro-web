import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../interface/category.interface';
import { AuthHeaders } from './auth-headers.service';
import { Lead } from '../interface/lead.interface';
import { LeadStatus } from '../interface/lead-status.interface';

@Injectable({
  providedIn: 'root'
})
export class LeadStatusService {
  private readonly _http = inject(HttpClient);
  private apiUrlBackend = environment.apiUrlBackend;
  private token:string = '';
  constructor( private authHeadersService: AuthHeaders) {
    
  }
  getAllLeadStatus(): Observable<{ leadStatus:LeadStatus[]}> {
    const headers = this.authHeadersService.getHeaders(); 
    return this._http.get<{ leadStatus:LeadStatus[]}>(`${this.apiUrlBackend}/lead-status`, headers);
  }
  
    

 
}
