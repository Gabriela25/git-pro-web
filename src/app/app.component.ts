import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { collection, Firestore, getDocs } from 'firebase/firestore';
import { SocketService } from './services/socket.service';
import { ModalComponent } from './shared/modal/modal.component';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { DatePipe } from '@angular/common';
import { environment } from '../environments/environment';
import { LeadAcceptedInfo } from './interface/lead-accepted-info';
import { ProfessionalInfo } from './interface/professional-info';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ModalComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DatePipe]
})
export class AppComponent {
  title = 'fixi';
  @ViewChild('modalPro') modalPro!: ModalComponent;
  @ViewChild('modalCustomer') modalCustomer!: ModalComponent;
  isSelected = false;



  titleModal: string = 'Order';
  messageOrder!: SafeHtml | string;
  alertTimeout: any;
  leadId: string = '';
  urlUploads: string = environment.urlUploads;
  constructor(
    private sanitizer: DomSanitizer,
    private socketService: SocketService,
    private datePipe: DatePipe,
    public router: Router
  ) { }

  ngOnInit() {
   
    this.authSocket()
    this.socketService.getMessage('search-pros').subscribe((response) => {
      this.openModal()
      if (!response) {
        return;
      }

      if (typeof response !== 'object') {
        return;
      }

      if (!('leads' in response)) {
        return;
      }

      const { leads } = response;

      //const { message , order}= orders;
      this.titleModal = 'You have received an order';
      this.messageOrder = this.sanitizer.bypassSecurityTrustHtml(`
        <div style="font-family: Arial, sans-serif;">
          <div style="text-align:center">
            <img  src="assets/avatar_profile.png" 
                   class="rounded-circle" 
                   style="width: 80px; height: 80px; object-fit: cover; display: block; margin: 0 auto;" />
            <span>${leads.user.firstname} ${leads.user.lastname}</span>
          </div>
        <div style="text-align: center;" >
            <h2 style="margin-bottom: 20px; font-size: 24px; font-weight: bold;">${leads.category.name}</h2>
        </div>
        <div style="margin-bottom: 10px;">
            <span><i class="bi bi-calendar"></i>     ${this.datePipe.transform(leads.createdAt, 'dd/MM/yyyy')}</span> 
        </div>
        <div style="margin-bottom: 10px;">
            <span><i class="bi bi-geo-alt-fill"></i>    ${leads.zipcode.name}</span>
        </div>
        <div style="margin-bottom: 10px;">
            <span><i class="bi bi-telephone"></i>    ${leads.phone}</span>
        </div>
        <div style="margin-bottom: 20px;">
            <span><i class="bi bi-card-text"></i>    ${leads.description} </span>
        </div>
        ${leads.imageUrl1
          ? `<div>
               <span><i class="bi bi-card-image"></i></span>
                <img src="${this.urlUploads}${leads.imageUrl1}" 
                     style="width: 200px; height: 120px; object-fit: cover; display: block; margin: 0 auto;" />
             </div>`
          : ''}
      
    </div>
     `);
      this.leadId = leads.id;
      this.openModal()
      // this.startAlertTimer();
    });
    //this.socketService.getMessage('lead-accepted-info').subscribe(this.onAcceptedOrderInfo);
    //this.socketService.getMessage('lead-accepted').subscribe(this.onAcceptedPro);
    this.socketService.getMessage('lead-accepted-info').subscribe((payload) => this.onAcceptedOrderInfo(payload));
    this.socketService.getMessage('lead-accepted').subscribe((payload) => this.onAcceptedPro(payload));
  
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
    this.socketService.sendMessage('accept-lead', {
      leadId: this.leadId
    });
  }
  closeModal() {
    this.modalPro.close();
  }

  openModal() {
    this.modalPro.open();
  }
  closeModalCustomer() {
    this.modalCustomer.close();
  }

  openModalCustomer() {
    this.modalCustomer.open();
  }
  onOrder(){
    this.router.navigate(['/pro/get-orders'])
  }
  //temporalmente no se va a mostrar
  onAcceptedOrderInfo(payload: unknown) {
    console.log('esperando recibir el modal para el profesional')
   

    if (typeof payload !== 'object') {
      return;
    }

    if (!payload) {
      return;
    }

    if (!('lead' in payload)) {
      return;
    }

    const { lead } = payload as { lead: LeadAcceptedInfo };

    if (lead.orderLimitReached) {
      this.messageOrder = 'This order has reached the limit of professionals';
      this.openModal();
      return;
    }
  }
 
  onAcceptedPro(payload: unknown) {
    

    if (typeof payload !== 'object') {
      return;
    }

    if (!payload) {
      return;
    }

    if (!('professional' in payload)) {
      return;
    }
    
    const { professional } = payload as { professional: ProfessionalInfo };
    this.titleModal = 'The professional has generated a service order';
      this.messageOrder = this.sanitizer.bypassSecurityTrustHtml(`
        <div style="font-family: Arial, sans-serif;">
          <div style="text-align:center">
            <img  src="${this.urlUploads}${professional.image}" 
                   class="rounded-circle" 
                   style="width: 80px; height: 80px; object-fit: cover; display: block; margin: 0 auto;" />
            <h2>${professional.fullname}</h2>
          </div>
        <div style="text-align: center;" >
            <p style="margin-bottom: 20px; font-size: 24px; font-weight: bold;">${professional.introduction}</p>
        </div>
        
        
    </div>
     `);
    this.openModalCustomer()
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


