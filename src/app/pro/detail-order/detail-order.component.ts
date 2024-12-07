import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { environment } from '../../../environments/environment.development';
import { ActivatedRoute } from '@angular/router';

import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DatePipe, CommonModule } from '@angular/common';
import { Lead } from '../../interface/lead.interface';
import { Order } from '../../interface/order.interface';
import { LeadService } from '../../services/lead.service';
import { OrderService } from '../../services/order.service';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Profile } from '../../interface/profile.interface';
import { User } from '../../interface/user.interface';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [

    HeaderComponent,
    ModalComponent,
    CommonModule
  ],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.css'
})
export default class DetailLeadComponent {
  orderId: string = '';
  leadId: string = '';
  title: string = '';
  image!: SafeHtml | string;
  isPro: boolean = false;
  @ViewChild('modal') modal!: ModalComponent;
  order: Order = {
    id: '',
    userId: '',
    user: {
      firstname: '',
      lastname: '',
      email: '',
      phone: ''
    },
    leadId: '',
    lead: {
      id: '',
      userId: '',
      user: {
        firstname: '',
        lastname: '',
        email: '',
        phone: ''
      },
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
      qtyPro: undefined,

    },

    assigned: false,
    comment: '',
    statusOrder: undefined,
  }
  urlUploads: string = environment.urlUploads;
  listUserPro: Array<User> = [];
  listOrderTemp : Array<Order> = [];
  constructor(
    private sanitizer: DomSanitizer,

    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService

  ) { }
  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    //todo 
    //se debe pasar es el leadId para obtener el listado de ordenes y de cada orden  sacar el users
    this.checkOrders(this.orderId);
    this.authService.user$.subscribe((data: any) => {
      console.log(data)
      if (data) {
        this.isPro = data.isPro || false;
      }
    });
  }

  checkOrders(orderId: string) {
    this.orderService.getOrderDetail(orderId).subscribe({
      next: (response) => {
        console.log(response)
        console.log('en la order')
        this.order = response.order;
        this.leadId= response.order.leadId;
        if(this.leadId){
          this.checkUsersPro(this.leadId)
        }
      },
      error: (error) => console.log(error)
    });
  }
  checkUsersPro(leadId: string) {
    this.orderService.getOrderbyLeadUser(leadId).subscribe({
      next: (response) => {
        console.log('buscando los profesionales')
        console.log(response)
        this.listOrderTemp = response.orders;
       
        for(let i=0; i<this.listOrderTemp.length; i++){
          this.listUserPro.push(this.listOrderTemp[i]['user'])
        }
       
        
      },
      error: (error) => console.log(error)
    });
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
}
