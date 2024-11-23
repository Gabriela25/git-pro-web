import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { Service } from '../../interface/service.interface';
import { Lead } from '../../interface/lead.interface';
import { LeadService } from '../../services/lead.service';
import { CommonModule, DatePipe } from '@angular/common';
import { LeadByOrder } from '../../interface/lead-by-order.interface';
import { environment } from '../../../environments/environment.development';
import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';


@Component({
  selector: 'app-get-leads',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ModalComponent
  ],
  templateUrl: './get-leads.component.html',
  styleUrl: './get-leads.component.css'
})
export default class GetLeadsComponent {
  urlUploads:string = environment.urlUploads;


  currentStep: number = 1;
  listLeds: Array<Lead> = [];
  listLeadByUser: Array<Lead> = [];
  weeks: number = 0;
  @ViewChild('modal') modal!: ModalComponent;
  image!: SafeHtml | string;
  title: string ='';
  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private leadService: LeadService,
  ) {
  }
  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    /*this.leadService.postOrderByPro().subscribe({
      next: (response) => this.listServices = response.services,
      error: (error) => console.error(error)
    });*/
    this.leadService.getLeadUser().subscribe({
      next: (response) => {
        this.listLeadByUser = response.leads
        console.log(this.listLeadByUser)  
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
    this.router.navigate([`pro/lead/detail/${id}`]);
  }
}
