import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { LeadStatusService } from './services/lead-status.service';
import { LeadStatus } from './interface/lead-status.interface';



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
  @ViewChild('modalProRejected') modalProRejected!: ModalComponent;
  
  isSelected = false;
  titleModal: string = 'Order';
  messageOrder!: SafeHtml | string;
  messageProRejected!: SafeHtml | string;
  alertTimeout: any;
  leadId: string = '';
  
  listLeadStatus: Array<LeadStatus> = [];
  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private socketService: SocketService,
    private datePipe: DatePipe,
    public  router: Router,
    private leadStatusService: LeadStatusService
  ) { }

  ngOnInit() {
    this.authSocket()
    this.socketService.getMessage('search-pros').subscribe((response) => {
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
      this.titleModal = 'You have received a new order request';
      this.messageOrder = this.sanitizer.bypassSecurityTrustHtml(`
        <div class="container" style="font-family: Arial, sans-serif;">
            <h2 class="mb-4 fw-bold text-center">${leads.category.name}</h2>
    
            <!--div class="mb-2">
                <span><i class="bi bi-person"></i> ${leads.user.firstname} ${leads.user.lastname}</span>
            </div-->
            <div class="mb-2">
                <span><i class="bi bi-calendar"></i> ${this.datePipe.transform(leads.createdAt, 'dd/MM/yyyy')}</span>
            </div>
            <div class="mb-2">
                <span><i class="bi bi-geo-alt-fill"></i> ${leads.zipcode.name}</span>
            </div>
            <!--div class="mb-2">
                <span><i class="bi bi-telephone"></i> ${leads.phone}</span>
            </div-->
            <div class="mb-2">
                <span><i class="bi bi-card-text"></i> ${leads.description}</span>
            </div>
          
           <div class="mb-4">
                <span> <i class="bi bi-image"></i> Image: </span>
            </div>
            <div class="row justify-content-center">
                ${[leads.imageUrl1, leads.imageUrl2, leads.imageUrl3, leads.imageUrl4, leads.imageUrl5, leads.imageUrl6]
                    .filter(image => image)
                    .map(image => `
                        <div class="col-12 mb-3 text-center">
                            <img src="${image}" class="img-fluid rounded shadow-sm cursor"
                                onclick="showImage('${image}')" 
                                 style="width: 75%; max-width: 500px; aspect-ratio: 16/9; object-fit: cover;">
                        </div>
                    `)
                    .join('')}
            </div>
        </div>
    `);
    
   
      this.leadId = leads.id;
      this.openModal();
      this.cdr.detectChanges();
      // this.startAlertTimer();
    });
 
    this.socketService.getMessage('lead-accepted-info').subscribe((payload) => this.onAcceptedOrderInfo(payload));
    this.socketService.getMessage('lead-accepted').subscribe((payload) => this.onAcceptedPro(payload));
     // Escuchar la respuesta de socket
   
    this.leadStatusService.getAllLeadStatus
    ().subscribe({
      next: (response) => {
        this.listLeadStatus = response.leadStatus;
        console.log(this.listLeadStatus)
      },
      error: (error) => {
      }
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
    this.socketService.sendMessage('accept-lead', {
      leadId: this.leadId,
    });
  }
  onRejectAction(){
    this.socketService.sendMessage('reject-lead', {
      leadId: this.leadId,
    });
  }
  openModal() {
    this.modalPro.open();
  }
  closeModal() {
    this.modalPro.close();
  } 
  openModalProRejected() {
    this.modalProRejected.open();
  }
  closeProRejected() {
    this.modalProRejected.close();
  } 
  openModalCustomer() {
    this.modalCustomer.open();
    this.cdr.detectChanges();     
  }
  closeModalCustomer() {
    this.modalCustomer.close();
  }
  onOrder(){
    this.router.navigate(['/pro/orders'])
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

    const { lead } = payload as { lead: any };
    if (lead.leadLimitReached) {    
      this.messageProRejected = this.sanitizer.bypassSecurityTrustHtml(`
        <div>
           <img src="/assets/close.png" style="width: 80px; height: 80px; object-fit: cover; display: block; margin: 0 auto;" />
          <h5>This order has reached the limit of professionals.</h5>
        </div>
      `);
      this.openModalProRejected();
     
      return;
      }
  }
 
  onAcceptedPro(payload: unknown) {
    console.log('siempre llego tarde')
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
          <div class="text-center">
            <img  src="${professional.image}" 
                   class="rounded-circle img-logo-pro"/>
            <h2>${professional.fullname}</h2>
          </div>
        <div class="text-center">
            <p style="">${professional.introduction}</p>
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


