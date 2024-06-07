import { Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { EventEmitter } from 'stream';

@Injectable({
  providedIn: 'root'
})
export class ComunicationService {

  
  private triggerDirection = new BehaviorSubject<any>(null);
  currentData = this.triggerDirection.asObservable();


  constructor() { }
  changeData(data: any) {
    this.triggerDirection.next(data);
  }
  
  

 
}
