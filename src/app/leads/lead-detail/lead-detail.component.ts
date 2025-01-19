import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';


import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule, DatePipe, Location } from '@angular/common';
import { environment } from '../../../environments/environment';

import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';
import { LeadAcceptedInfo } from '../../interface/lead-accepted-info';
import { UserService } from '../../services/user.service';
import { OrderByLead } from '../../interface/lead-by-order.interface';
import { Lead } from '../../interface/lead.interface';
import { LeadService } from '../../services/lead.service';


@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ModalComponent
  ],
  templateUrl: './lead-detail.component.html',
  styleUrl: './lead-detail.component.css'
})
export default class LeadDetailComponent {
  leadId: string = '';
  orderByLead: Array<OrderByLead> = [];
  title: string = '';
  bodyModal!: SafeHtml | string;
  isPro: boolean = false;
  isLoading: boolean = false;
  backendMessage: string = '';
  alertMessage: string = '';
  alertTimeout: any;
  userId: string | undefined = '';
  isNotAcceptOrder: boolean = false;
  @ViewChild('modal') modal!: ModalComponent;

  lead: Lead = {
    id: '',
    userId: '',
    zipcode: {
      id: '',
      name: '',
      code: ''
    },
    categoryId: '',
    category: {
      id: '',
      name: '',
      description: '',
      image: '',
      statusId: ''
    },
    zipcodeId: '',
    phone: '',
    description: '',
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    imageUrl4: '',
    imageUrl5: '',
    imageUrl6: '',
   
    qtyPro: 0

  }
  //revisar
  
  urlUploads: string = environment.urlUploads;
  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private leadService: LeadService,
    private authService: AuthService,
    private socketService: SocketService,
    private userService: UserService
  ) {

  }
  ngOnInit() {
    this.leadId = this.route.snapshot.paramMap.get('id')!;
    this.checkLead(this.leadId);
    //this.checkLeads(this.leadId);
    this.authService.user$.subscribe((data: any) => {

      this.isPro = data.isPro || false;


    });
    //se pierdeel contexto original de la clase
    //this.socketService.getMessage('order-accepted-info').subscribe(this.onAcceptedOrderInfoApp);
    this.socketService.getMessage('lead-accepted-info').subscribe((payload) => {
      this.onAcceptedOrderInfoApp(payload);
    });
  }
  checkLead(leadId: string) {
    console.log('entree')
    this.leadService.getLeadDetail(leadId).subscribe({
      next: (response) => {
        console.log(response)
        this.lead = response.lead;
        this.userId = response.lead.userId;
        this.checkUserProfile()
      },
      error: (error) => console.log(error)
    });
  }
  checkUserProfile() {
    this.userService.getMe().subscribe({
      next: (response) => {
        console.log(response.user.id)
        //si los userId son iguales, indica que es el mismo usuario que genero la orden
        if (response.user.id === this.userId) {
          this.isNotAcceptOrder = true;
        }
      },
      error: (error) => console.error(error)
    });
  }
  checkLeads(orderId: string) {
    const data = {
      orderId: orderId
    }

    /*this.leadService.postLead(data).subscribe({
      next: (response) => {
        this.orderByLead = response.leads;
        console.log(response)
      },
      error: (error) => console.log(error)
    });*/
  }
  showImage(urlImage: string) {
    this.bodyModal = this.sanitizer.bypassSecurityTrustHtml(`
      <div>
    
         <img src=${urlImage}
                  
           style="width: 200px; height: 200px; object-fit: cover; display: block; margin: 0 auto;" />
       
      </div>
    `);
    this.openModal()
  }
  closeModal() {
    this.modal.close();
  }
  openModal() {
    this.modal.open();
  }
  accept() {
    console.log("Confirmación del modal recibida");
    this.isLoading = true;
    this.socketService.sendMessage('accept-lead', {
      leadId: this.leadId

    });
  }
  onAcceptedOrderInfoApp(payload: unknown) {
    console.log(payload)
    this.isLoading = true;
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
      this.isLoading = false;
      this.bodyModal = this.sanitizer.bypassSecurityTrustHtml(`
        <div>
           <img src="/assets/close.png"
                  
           style="width: 120px; height: 120px; object-fit: cover; display: block; margin: 0 auto;" />
          <h3>This order has reached the limit of professionals.</h3>
        </div>
      `);

      this.openModal();
      return;
    }
    else {
      this.handleSuccessfulSubmission(lead)
    }
  }

  handleSuccessfulSubmission(response: any) {
    this.alertMessage = 'alert-success';
    this.backendMessage = response.message || 'The order has been successfully accepted';
    this.isLoading = false;
    this.startAlertTimer();
  }

  handleError(error: any) {
    this.alertMessage = 'alert-danger';
    this.backendMessage = error.error.message || 'An error occurred';
    this.isLoading = false;
    this.startAlertTimer();
  }
  startAlertTimer() {
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    this.alertTimeout = setTimeout(() => {
      this.router.navigate(['/pro/get-leads'])
      this.backendMessage = '';
    }, 3000);
  }
}
