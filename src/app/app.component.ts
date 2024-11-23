import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { collection, Firestore, getDocs } from 'firebase/firestore';
import { SocketService } from './services/socket.service';
import { ModalComponent } from './shared/modal/modal.component';
import { Order } from './interface/order.interface';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { OrderAcceptedInfo } from './interface/order-accepted-info';
import { DatePipe } from '@angular/common';
import { environment } from '../environments/environment.development';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DatePipe]
})
export class AppComponent {
  title = 'firebase-cms';
  @ViewChild('modalPro') modalPro!: ModalComponent;
  isSelected = false;



  titleModal: string = 'Order';
  messageOrder!: SafeHtml | string;
  alertTimeout: any;
  orderId: string = '';
  urlUploads: string = environment.urlUploads;
  constructor(
    private sanitizer: DomSanitizer,
    private socketService: SocketService,
    private datePipe: DatePipe
  ) { }

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

      const { orders } = response;

      //const { message , order}= orders;
      this.titleModal = 'You have received an order';
      this.messageOrder = this.sanitizer.bypassSecurityTrustHtml(`
        <div style="font-family: Arial, sans-serif;">
          <div style="text-align:center">
            <img  src="assets/avatar_profile.png" 
                   class="rounded-circle" 
                   style="width: 80px; height: 80px; object-fit: cover; display: block; margin: 0 auto;" />
            <span>${orders.user.firstname} ${orders.user.lastname}</span>
          </div>
        <div style="text-align: center;" >
            <h2 style="margin-bottom: 20px; font-size: 24px; font-weight: bold;">${orders.category.name}</h2>
        </div>
        <div style="margin-bottom: 10px;">
            <span><i class="bi bi-calendar"></i>     ${this.datePipe.transform(orders.createdAt, 'dd/MM/yyyy')}</span> 
        </div>
        <div style="margin-bottom: 10px;">
            <span><i class="bi bi-geo-alt-fill"></i>    ${orders.zipcode.name}</span>
        </div>
        <div style="margin-bottom: 10px;">
            <span><i class="bi bi-telephone"></i>    ${orders.phone}</span>
        </div>
        <div style="margin-bottom: 20px;">
            <span><i class="bi bi-card-text"></i>    ${orders.description} </span>
        </div>
        ${orders.images
          ? `<div>
               <span><i class="bi bi-card-image"></i></span>
                <img src="${this.urlUploads}${orders.images}" 
                     style="width: 200px; height: 120px; object-fit: cover; display: block; margin: 0 auto;" />
             </div>`
          : ''}
      
    </div>
     `);
      this.orderId = orders.id;
      this.openModal()
      // this.startAlertTimer();
    });
    this.socketService.getMessage('order-accepted-info').subscribe(this.onAcceptedOrderInfo);

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
    this.socketService.sendMessage('accept-order', {
      orderId: this.orderId
    });
  }
  closeModal() {
    this.modalPro.close();
  }

  openModal() {
    this.modalPro.open();
  }

  onAcceptedOrderInfo(payload: unknown) {

    if (typeof payload !== 'object') {
      return;
    }

    if (!payload) {
      return;
    }

    if (!('order' in payload)) {
      return;
    }

    const { order } = payload as { order: OrderAcceptedInfo };

    if (order.orderLimitReached) {
      this.messageOrder = 'This order has reached the limit of professionals';
      this.openModal();
      return;
    }
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


