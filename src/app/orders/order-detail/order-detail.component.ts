import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interface/order.interface';
import { ActivatedRoute } from '@angular/router';
import { OrderList } from '../../interface/order-list.interface';
import { CommonModule, DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { LeadService } from '../../services/lead.service';
import { LeadByOrder } from '../../interface/lead-by-order.interface';
import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ModalComponent
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export default  class OrderDetailComponent {
  orderId: string ='';
  leadByOrderList: Array<LeadByOrder> = [];
  title:string = '';
  image!: SafeHtml | string;
  @ViewChild('modal') modal!: ModalComponent;
  order: OrderList = {
    id: '',
    userId:  '',
    zipcode:{
      id:'',
      name:'',
      code:''
    },
    categoryId: '',
    category:{
      id:'',
      name:'',
      description:'',
      image: '',
      statusId:''
    },
    zipcodeId:'',
    phone: '',
    description:'',
    images:'',
    statusOrder: '',
    qtyPro:0
  }
  leadByOrder: LeadByOrder = {
    id: "",
    userId: "",
    user: {
      id: "",
      email: "",
      emailVerifiedAt: undefined,
      enabled: false,
      firstname: "",
      lastname: "",
      logginAttempts: 0,
      phone: "",
      profile: {
        id: "",
        address: "",
        available: false,
        imageBusiness: '',
        imagePersonal: '',
        introduction: "",
        isBusiness: false,
        nameBusiness: null,
        numberOfemployees: null,
        zipcodeId: "",
        yearFounded: null,
        categories:[]
      },
    },
    orderId: "",
    order: {
      id: "",
      userId: "",
      categoryId: "",
      zipcodeId: "",
      phone: "",
      description: "",
      images: "",
      statusOrder: "",
      qtyPro: undefined,   
    },
    assigned: false,
    comment: "",
    statusLead: "",
   
  };
  urlUploads: string = environment.urlUploads;
  constructor( 
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private orderService: OrderService,
    private leadService: LeadService,
  ){
   
  }
  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.checkOrder(this.orderId );
    this.checkLeads(this.orderId );
  }
  checkOrder(orderId: string){
    this.orderService.getOrderDetail(orderId).subscribe({
      next: (response) => {
        this.order = response.order;
        console.log(response)
      },
      error: (error) => console.log(error)
    });
  }
  checkLeads(orderId: string){
    const data =  {
       orderId: orderId
    }
    
    this.leadService.postLeadByOrder(data).subscribe({
      next: (response) => {
        this.leadByOrderList = response.leads;
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
