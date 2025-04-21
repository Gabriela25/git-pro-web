
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



@Component({
  selector: 'app-leads',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgxPaginationModule,
    HeaderComponent,
    ModalComponent
  ],
  templateUrl: './leads.component.html',
  styleUrl: './leads.component.css'
})
export default class LeadListComponent {
  leadList: Array<Lead> =[];
  urlUploads: string = environment.urlUploads;
  messageLead!: SafeHtml | string;
  title: string ='';
  page: number = 1;
  pageSize: number = 10;
  @ViewChild('modal') modal!: ModalComponent;
 
  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private leadService: LeadService,
    
  ){

  }
  ngOnInit(): void {
    this.checkLeads();
  }

  checkLeads(){
    //ordenamos descendente.
    this.leadService.getLeads().subscribe({
      next: (response) => {     
        this.leadList = response.leads.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt).getTime(); 
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA; 
        });
      },
      error: (error) => console.error(error)
    });
  }
  
  showImage(urlImage: string){
    this.messageLead = this.sanitizer.bypassSecurityTrustHtml(`
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
    this.router.navigate([`/client/lead/detail/${id}`]);
  }
}
