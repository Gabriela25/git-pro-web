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
import { FormsModule } from '@angular/forms';
import { LeadStatusService } from '../../services/lead-status.service';
import { error } from 'console';
import { LeadStatus } from '../../interface/lead-status.interface';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationComponent } from '../../shared/pagination/pagination.component';



@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    NgxPaginationModule,
    HeaderComponent,
    ModalComponent,
    PaginationComponent
  ],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.css'
})
export default class GetLeadsComponent {
  //urlUploads: string = environment.urlUploads;
  currentStep: number = 1;
  leads: Array<Lead> = [];
  myLeads: Array<Lead> = [];
  leadStatus: Array<LeadStatus> = [];
  weeks: number = 0;
  image!: SafeHtml | string;
  title: string = '';

  filteredLeads: any[] = [];
  selectedStatus: string = '';
  uniqueStatuses: string[] = [];
  @ViewChild('modal') modal!: ModalComponent;

  total: number = 0;
  page: number = 1;
  limit: number =10;
  lastPage: number = 1;
  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private leadService: LeadService,
    private leadStatusService: LeadStatusService
  ) { }

  ngOnInit(): void {
    this.selectedStatus = 'Pending';
    this.loadInitialData(this.page);


  }
  getUniqueStatuses() {
    this.uniqueStatuses = [...new Set(this.leadStatus.map(item => item.name))];
  }

  filterLeads() {

    if (this.selectedStatus) {
      this.filteredLeads = this.leads.filter(lead =>
        lead.leadRequests[0]?.leadStatus?.name === this.selectedStatus
      );
    } else {
      this.filteredLeads = [...this.leads];
    }
  }
  loadInitialData(page: number) {
    this.page = page;
    this.leadService.getLeadAllByPro(this.page,this.limit).subscribe({
      next: (response) => {
        
        this.leads = response.leads;
        this.total = response.total;
        this.page = response.page;
        this.limit = response.limit;
        this.lastPage = Math.ceil(this.total / this.limit);
        this.filterLeads()
      },
      error: (error) => console.error(error)
    });
    this.leadService.getLeads(this.page,this.limit).subscribe({
      next: (response) => {

        this.myLeads = response.leads
        
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.leadStatusService.getAllLeadStatus().subscribe({
      next: (response) => {
        this.leadStatus = response.leadStatus;
        this.getUniqueStatuses();

      },
      error: (error) => { }
    })
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
  }

  showImage(urlImage: string) {
    this.image = this.sanitizer.bypassSecurityTrustHtml(`
      <div style="font-family: Arial, sans-serif;">
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
  leadDetail(id: string) {

    this.router.navigate([`/client/lead/detail/${id}`]);
  }
  /*orderDetail(id:string){
    this.router.navigate([`/orders/detail/${id}`]);
  }*/

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'text-bg-warning';
      case 'Accepted':
        return 'text-bg-success';
      case 'Rejected':
        return 'text-bg-danger';
      case 'Expired':
        return 'text-bg-light';
      default:
        return 'text-bg-secondary';
    }
  }

  onPageChange(newPage: number) {
    this.loadInitialData(newPage);
  }
}
