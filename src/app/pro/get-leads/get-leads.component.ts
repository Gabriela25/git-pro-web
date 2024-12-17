import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { Service } from '../../interface/service.interface';

import { CommonModule, DatePipe } from '@angular/common';

import { environment } from '../../../environments/environment';
import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../interface/order.interface';
import { LeadService } from '../../services/lead.service';
import { OrderService } from '../../services/order.service';
import { Lead } from '../../interface/lead.interface';



@Component({
  selector: 'app-get-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    ModalComponent
  ],
  templateUrl: './get-leads.component.html',
  styleUrl: './get-leads.component.css'
})
export default class GetLeadsComponent {
  urlUploads:string = environment.urlUploads;


  currentStep: number = 1;
  listLeads: Array<Lead> = [];
  listMyLeads:  Array<Lead> = [];

  weeks: number = 0;
  @ViewChild('modal') modal!: ModalComponent;
  image!: SafeHtml | string;
  title: string ='';
  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
   
    private leadService: LeadService,
    private orderService: OrderService,

  ) {
  }
  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    
    this.leadService.getLeadAllByPro().subscribe({
      next: (response) =>{
       this.listLeads =  response.leads.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime(); 
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; 
      });
      },
      error: (error) => console.error(error)
    });
    this.leadService.getLeads().subscribe({
      next: (response) => {
        this.listMyLeads = response.leads.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt).getTime(); 
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA; 
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep = step;  
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
  leadDetail(id:string){
    this.router.navigate([`leads/detail/${id}`]);
  }
  /*orderDetail(id:string){
    this.router.navigate([`/orders/detail/${id}`]);
  }*/
}
