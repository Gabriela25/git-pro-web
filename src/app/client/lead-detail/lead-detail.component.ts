import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LeadService } from '../../services/lead.service';
import { SocketService } from '../../services/socket.service';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { Lead } from '../../interface/lead.interface';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule,ModalComponent, HeaderComponent],
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.css']
})
export default class LeadDetailComponent implements OnInit {
  leadId: string = '';
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
    qtyPro: 0,
    leadRequests:[]
  };
  orderByLead: Array<any> = [];
  title: string = '';
  bodyModal!: SafeHtml | string;
  isPro: boolean = false;
  isLoading: boolean = false;
  backendMessage: string = '';
  alertMessage: string = '';
  alertTimeout: any;
  userId: string | undefined = '';
  isNotAcceptOrder: boolean = false;
  urlUploads: string = environment.urlUploads;

  @ViewChild('modal') modal!: ModalComponent;

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private leadService: LeadService,
    private socketService: SocketService,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Escuchamos si el id cambia de valor.
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.leadId = id;
        this.checkLead(this.leadId); 
      }
    });

    // Escuchar la respuesta de socket
    this.socketService.getMessage('lead-accepted-info').subscribe((payload) => {
      this.onAcceptedOrderInfoApp(payload);
    });
    this.socketService.getMessage('lead-rejected-info').subscribe((payload) => {
      this.onRejectedLead(payload);
    });
   
    // revisamos si el usuario es profesional
    this.authService.user$.subscribe((data: any) => {
      this.isPro = data.isPro || false;
    });
  }

  //mostramos el detalle de lead
  checkLead(leadId: string) {
    this.isLoading = true;
    this.leadService.getLeadDetail(leadId).subscribe({
      next: (response) => {
        this.lead = response.lead;
        this.userId = response.lead.userId;
        this.checkUserProfile();
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }
  // Verificar si el perfil del usuario coincide con el lead
  checkUserProfile() {
    this.userService.getMe().subscribe({
      next: (response) => {
        if (response.user.id === this.userId) {
          this.isNotAcceptOrder = true;
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
  // Mostrar la imagen en el modal
  showImage(urlImage: string) {
    this.bodyModal = this.sanitizer.bypassSecurityTrustHtml(`
      <div>
         <img src=${urlImage} style="width: 200px; height: 200px; object-fit: cover; display: block; margin: 0 auto;" />
      </div>
    `);
    this.openModal();
   
  }
  openModal() {
    this.modal.open();
  }
  closeModal() {
    this.modal.close();
  }
  onAcceptLead() {
    this.isLoading = true;
    this.socketService.sendMessage('accept-lead', {
      leadId: this.leadId
    });
  }
  onRejectLead(){
    this.socketService.sendMessage('reject-lead', {
      leadId: this.leadId,
    });
   
  }
  onAcceptedOrderInfoApp(payload: any) {
    if (typeof payload !== 'object') return;
    if (!payload || !('lead' in payload)) return;
    const { lead } = payload as { lead: any };

    
    if (lead.leadLimitReached) {
      /*this.isLoading = false;
      this.bodyModal = this.sanitizer.bypassSecurityTrustHtml(`
        <div>
           <img src="/assets/close.png" style="width: 80px; height: 80px; object-fit: cover; display: block; margin: 0 auto;" />
          <h5>This order has reached the limit of professionals.</h5>
        </div>
      `);
      this.openModal();*/
      this.checkLead( this.leadId)
      return;
    } else {
      this.handleSuccessfulSubmission('alert-success',lead,'The order has been successfully accepte');
    }
  }
  onRejectedLead(payload: any) {
    if (typeof payload !== 'object') return;
    if (!payload || !('lead' in payload)) return;
    const { lead } = payload as { lead: any };
    if (lead) {
      this.isLoading = false;
      this.handleSuccessfulSubmission('alert-warning',lead,'Contact support to review lead conditions.');
    } 
    
  }
  handleSuccessfulSubmission(typeMessage: string,response: any, message: string) {
    this.alertMessage = typeMessage;
    this.backendMessage = response.message || message;
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
      this.router.navigate(['/pro/leads']);
      this.backendMessage = '';
    }, 3000);
  }
}
