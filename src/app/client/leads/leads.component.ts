
import { Component, ViewChild } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HeaderComponent } from '../../shared/header/header.component';
import { LeadService } from '../../services/lead.service';
import { Lead } from '../../interface/lead.interface';
import { ModalComponent } from '../../shared/modal/modal.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';



@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgxPaginationModule,
    HeaderComponent,
    ModalComponent,
    PaginationComponent
  ],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.css'
})
export default class LeadListComponent {
  leads: Array<Lead> = [];
  urlUploads: string = environment.urlUploads;
  messageLead!: SafeHtml | string;
  title: string = '';
  total:number = 0;
  page:number = 1;
  limit:number = 10;
  lastPage:number = 1;
  @ViewChild('modal') modal!: ModalComponent;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private leadService: LeadService,

  ) {

  }
  ngOnInit(): void {
    this.getLeads(this.page);
  }

  getLeads(page: number) {
    this.page = page;
    this.leadService.getLeads(this.page, this.limit).subscribe({
      next: (response) => {

        this.leads = response.leads;
        this.total = response.total;
        this.page = response.page;
        this.limit = response.limit;
        this.lastPage = Math.ceil(this.total / this.limit);

      },
      error: (error) => console.error(error)
    });
  }

  showImage(urlImage: string) {
    this.messageLead = this.sanitizer.bypassSecurityTrustHtml(`
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

  onPageChange(newPage: number) {
    this.getLeads(newPage);
  }


}
