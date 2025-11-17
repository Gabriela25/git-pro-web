import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

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
import { OrderStatus } from '../../interface/order-status.interface';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SocketService } from '../../services/socket.service';
import { OrderStatusService } from '../../services/order-status.service';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    HeaderComponent,
    ModalComponent,
  ],
  providers: [
    provideNgxMask(),

  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css'
})
export default class DetailLeadComponent {
  orderId: string = '';
  leadId: string = '';
  title: string = '';
  image!: SafeHtml | string;
  messageUpdateOrder!: SafeHtml | string;
  isPro: boolean = false;
  @ViewChild('modal') modal!: ModalComponent;
  @ViewChild('modalUpdateStatus') modalUpdateStatus!: ModalComponent;
  updateOrderForm!: FormGroup;
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
        urlImage: '',
        stripePriceId: ''
      },
      zipcodeId: '',
      zipcode: {
        id: '',
        code: '',
        name: ''
      },
      phone: '',
      description: '',
      qtyPro: undefined,
      imageUrl1: '',
      imageUrl2: '',
      imageUrl3: '',
      imageUrl4: '',
      imageUrl5: '',
      imageUrl6: '',
      leadRequests :[]
    },
    
    assigned: false,
    comment: '',
    orderStatusId: '',
  
    orderStatus: {
      name: ''
    }
  }
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
      urlImage: '',
      statusId: '',
      stripePriceId: '',
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
  //urlUploads: string = environment.urlUploads;
  listUserPro: Array<any> = [];
  listOrderTemp: Array<Order> = [];
  orderStatus: Array<OrderStatus> = [];
  orderStatusCanceled : Array<OrderStatus> = [];
  orderStatusId: string = '';
  orderIdUserPro: string  = '';
  isLoading = false;
  isUpdatingStatus = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  orderCanceledForm!: FormGroup;
  status : OrderStatus = {
    name:''
  }
  selectedLabel: string = '';
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService,
    private orderStatusService: OrderStatusService,
    private leadService: LeadService,
    private socketService: SocketService,
    
  
  ) {
    
  }
  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.authService.user$.subscribe((data: any) => {
      if (data) {
        this.isPro = data.isPro || false;
      }
    });
    //se debe pasar es el orderId para obtener el listado de ordenes y de cada orden  sacar el users
    this.checkOrders(this.orderId);
    this.initializeCanceledFormForm()
  }
  
  initializeCanceledFormForm() {
    this.orderCanceledForm = this.fb.group({
      optionsCanceled: this.fb.control('')
    });
  }
  
 

  checkOrders(orderId: string) {
    this.orderStatusService.getAllOrderStatus().subscribe({
      next: (response) => {
        this.orderStatus = response.orderStatus.filter(status=>status.name==='Scheduled' || status.name==='Completed' || status.name==='Canceled')
        this.orderStatusCanceled = response.orderStatus.filter(status=>status.name==='Request new pro' || status.name==='NoT scheduled yet')
        const order = ['Scheduled', 'Completed', 'Canceled'];
        this.orderStatus = response.orderStatus
          .filter(status =>
            status.name === 'Scheduled' ||
            status.name === 'Completed' ||
            status.name === 'Canceled'
          )
          .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
      },
      error: (error) => console.error(error)
    });
    this.orderService.getOrderDetail(orderId).subscribe({
      next: (response) => {
        this.order = response.order;
        this.leadId = response.order.leadId;
        this.orderStatusId = response.order.orderStatus.id!;
        /*this.updateOrderForm.patchValue({
          orderStatus:  this.orderStatusId
         
        });*/

        if (this.leadId && !this.isPro) {
          //si el usuario es cliente, revisamos los pro que ya tienen esa orden
          this.checkUsersPro(this.leadId)
        }
        else{
          this.updateOrderForm.patchValue({
            orderStatus:  this.orderStatusId
          });
        }
      },
      error: (error) => console.log(error)
    });

  }
  checkUsersPro(leadId: string) {
    console.log(leadId)
    this.orderService.getOrderbyLeadUser(leadId).subscribe({
      next: (response) => {
        this.listOrderTemp = response.orders;
        console.log(response.orders)
        for (let i = 0; i < this.listOrderTemp.length; i++) {
          this.listUserPro.push(
            {
              "user": this.listOrderTemp[i]['user'],
              "orderId": this.listOrderTemp[i]['id'],
              "orderStatus": this.listOrderTemp[i]['orderStatus'],
            }
          )
        }
        //this.orderStatusArray.clear();
        /*this.listOrderTemp.forEach((order) => {    
          this.orderStatusArray.push(
            this.fb.control(order.orderStatusId, Validators.required)
          );
        });*/
      },
      error: (error) => console.log(error)
    });
    this.leadService.getLeadDetail(leadId).subscribe({
      next: (response) => {
        this.lead = response.lead;
        
        
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
      this.toggleModal(this.modal, 'open');
  }
  toggleModal(modal: any, action: 'open' | 'close') {
    modal[action]();
  }

  handleSuccessfulSubmission(response: any) {
    this.alertMessage = 'alert-success';
    this.backendMessage = response.message || 'Status order updated successfully';
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
      this.backendMessage = '';
      //this.router.navigate([`/pro/orders`]);
    }, 3000);
  }

  updatedOrderStatus(orderId: string, value: OrderStatus) {
   
    this.orderIdUserPro = orderId;
    this.title = 'Updated order';
    this.status = value;
     console.log(this.status.name)
    // Inicializar el formulario antes de asignar el mensaje
    
    if (this.status.name === 'Canceled') {
      this.orderCanceledForm.reset();
      this.messageUpdateOrder = this.sanitizer.bypassSecurityTrustHtml(`
        <div> 
          <h5 class="text-center">   
            You want to update the order to ${this.status.name}
          </h5>
          <form [formGroup]="orderCanceledForm">
            <div class="text-center">
            </div>
          </form>
        </div>
      `);
    } else {
      this.messageUpdateOrder = this.sanitizer.bypassSecurityTrustHtml(`
        <div> 
          <h5 class="text-center">   
            You want to update the order to ${this.status.name}
          </h5>
        </div>
      `);
    }
  
    // Suscribirse para obtener el valor seleccionado en los radio buttons
   
  
    this.toggleModal(this.modalUpdateStatus, 'open');
  }

    
   
  onConfirmAction(){
    // Activar loading
    this.isUpdatingStatus = true;
    this.toggleModal(this.modalUpdateStatus, 'close');
    
    let data  = {}
    const selectedOptionCanceled = this.orderCanceledForm.value.optionsCanceled;
    // Es porque el usuario no seleccionó ninguna opción del radio.
    console.log(this.orderCanceledForm)
    if(selectedOptionCanceled === '' || selectedOptionCanceled ===null){
       data  = {
        orderStatusId: this.status.id
      }
    }
    else {
      data = {
        orderStatusId: selectedOptionCanceled
      }
      this.orderCanceledForm.reset()
    }
    
    this.orderService.updatedOrder(this.orderIdUserPro , data).subscribe({
      next: (response) => {
        const index = this.listUserPro.findIndex((order) => order.orderId === this.orderIdUserPro);
  
        if (index !== -1) {
          this.listUserPro[index] = {
            user: response.order.user,  
            orderId: response.order.id, 
            orderStatus: response.order.orderStatus, 
          };
        }
        this.listUserPro = [...this.listUserPro];
  
        this.handleSuccessfulSubmission(response);
         
        if(this.selectedLabel === 'Request new pro'){
          const lead = this.lead;
          
          this.socketService.sendMessage('forwarding-lead', { lead });
        }

        // Actualizar el objeto order con el nuevo status
        this.order.orderStatus = response.order.orderStatus;
        
        // Desactivar loading después de un breve delay
        setTimeout(() => {
          this.isUpdatingStatus = false;
        }, 1500);
      },
      error: (error) => {
        this.isUpdatingStatus = false;
        this.handleError(error);
      }
    });
  }
  

  onCancelAction(){
    this.toggleModal(this.modalUpdateStatus, 'close');
  }

  onRadioChange(selectedItem: any) {
    this.selectedLabel = selectedItem.name;
  }

  // Método para verificar si los botones deben estar desactivados
  isButtonDisabled(): boolean {
    return this.isUpdatingStatus || 
           this.order.orderStatus.name === 'Completed' || 
           this.order.orderStatus.name === 'Canceled';
  }
}
