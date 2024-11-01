import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { collection, Firestore, getDocs } from 'firebase/firestore';
import { SocketService } from './services/socket.service';
import { ModalComponent } from './shared/modal/modal.component';
import { Order } from './interface/order.interface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent  {
  title = 'firebase-cms';
  @ViewChild('modalPro') modalPro!: ModalComponent;
  isSelected = false;
 


  titleModal: string = 'Order';
  messageOrder!: SafeHtml | string;
  alertTimeout: any;
  constructor(
    private sanitizer: DomSanitizer,
    private socketService: SocketService,
    
  ) {}

  ngOnInit() {
    this.authSocket()
    this.socketService.getMessage('search-pros').subscribe((response) => {
      console.log(response);
      this.openModal()
      if (!response) {
        return;
      }

      if (typeof response !== 'object') {
        return;
      }

      if (!('orders' in response)) {
        return;
      }

      const {  orders } = response ;
  
      const { message , order}= orders;
      this.titleModal = 'You have received an order';
      this.messageOrder = this.sanitizer.bypassSecurityTrustHtml(`
        <div>
           <ul>
              <li>Date: ${order.createdAt}</li>
              <li>Zipcode: ${order.zipcodeId}</li>
              <li>Description: ${order.description}</li>
           </ul>
        </div>
     `);
      this.openModal()
      this.startAlertTimer();
    });
  }

  authSocket() {
    if (localStorage.getItem('token')) {
      this.socketService.sendMessage('auth', {});
    }
  }
  /*firestore = inject(Firestore);

  ngOnInit() {
    getDocs(collection(this.firestore, "testPath")).then((response) => {
      console.log(response.docs)
    })
  }*/
  onConfirmAction() {
    console.log("Confirmación del modal recibida");
   
  }
  closeModal(){
    this.modalPro.close();
  }

  openModal() {
    this.modalPro.open();
  }
  startAlertTimer() {
    if (this.alertTimeout) {
       clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
       this.closeModal()
    }, 3000); 
  }
}


