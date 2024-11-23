import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { environment } from '../../../environments/environment.development';
import { ActivatedRoute } from '@angular/router';
import { LeadService } from '../../services/lead.service';
import { Lead } from '../../interface/lead.interface';
import { LeadByOrder } from '../../interface/lead-by-order.interface';
import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-lead',
  standalone: true,
  imports: [
    HeaderComponent,
    ModalComponent,
    CommonModule
  ],
  templateUrl: './detail-lead.component.html',
  styleUrl: './detail-lead.component.css'
})
export default class DetailLeadComponent {
  leadId: string = '';
  title: string = '';
  image!: SafeHtml | string;
  @ViewChild('modal') modal!: ModalComponent;
  lead: Lead = {
    id: '',
    userId: '',
    order: {
      id: '',
      userId: '',
      categoryId: '',
      category: {
        id: '',
        name: '',
        description: '',
        statusId: '',
        image: ''
      },
      zipcodeId: '',
      zipcode: {
        id: '',
        code: '',
        name: ''
      },
      phone: '',
      description: '',
      images: '',
      statusOrder: undefined,
      qtyPro: undefined,
     
    },
    orderId: '',
    assigned: false, 
    comment: '',
    statusLead: undefined, 
  }
    urlUploads: string = environment.urlUploads;
    constructor(
      private sanitizer: DomSanitizer,
      
      private route: ActivatedRoute,
      private leadService: LeadService,
    ) { }
  ngOnInit() {
      this.leadId = this.route.snapshot.paramMap.get('id')!;

      this.checkLeads(this.leadId);
    }
  
  checkLeads(leadId: string) {

      this.leadService.getLeadDetail(leadId).subscribe({
        next: (response) => {
          this.lead = response.lead;
          console.log(response)
        },
        error: (error) => console.log(error)
      });
    }
    showImage(urlImage: string){
      this.image = this.sanitizer.bypassSecurityTrustHtml(`
        <div style="font-family: Arial, sans-serif;">
      
           <img src=${urlImage}
                    
             style="width: 200px; height: 200px; object-fit: cover; display: block; margin: 0 auto;" />
         
        </div>
      `);
      this.openModal()
    }
    closeModal(){
      this.modal.close();
    }
    openModal() {
      this.modal.open();
    }
  }
