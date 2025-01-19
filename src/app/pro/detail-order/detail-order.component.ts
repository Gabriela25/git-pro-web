import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { environment } from '../../../environments/environment';
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
import { StatusOrderService } from '../../services/statusOrder.service';
import { StatusOrder } from '../../interface/status-order.interface';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [

    HeaderComponent,
    ModalComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    provideNgxMask(),

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
      qtyPro: undefined,
      imageUrl1: '',
      imageUrl2: '',
      imageUrl3: '',
      imageUrl4: '',
      imageUrl5: '',
      imageUrl6: '',
    },
    
    assigned: false,
    comment: '',
    statusOrderId: '',
    statusOrder: {
      name: ''
    }
  }
  urlUploads: string = environment.urlUploads;
  listUserPro: Array<any> = [];
  listOrderTemp: Array<Order> = [];
  listStatusOrder: Array<StatusOrder> = [];
  statusOrderId: string = '';
  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,

    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService,
    private statusOrderService: StatusOrderService

  ) {
    
  }
  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.authService.user$.subscribe((data: any) => {

      if (data) {
        this.isPro = data.isPro || false;
        console.log('cero')
      }
    });

    //todo 
    //se debe pasar es el leadId para obtener el listado de ordenes y de cada orden  sacar el users

    this.checkOrders(this.orderId);
    this.updateOrderForm = this.initializeUpdateOrderForm()
  }
  initializeUpdateOrderForm(): FormGroup {
    
    if(this.isPro){
      return this.fb.group({
        //statusOrder: this.fb.array([]),
        statusOrder:new FormControl('', [Validators.required]),
      });
    }else{
      return this.fb.group({
        statusOrder: this.fb.array([]),
      });
    }
    
  }
  get statusOrderArray(): FormArray {
  
    return this.updateOrderForm.get('statusOrder') as FormArray;
  }

  checkOrders(orderId: string) {

    this.statusOrderService.getAllStatusOrder().subscribe({
      next: (response) => {
        this.listStatusOrder = response.statusOrder;
      },
      error: (error) => console.error(error)
    });
    this.orderService.getOrderDetail(orderId).subscribe({
      next: (response) => {
        this.order = response.order;
        this.leadId = response.order.leadId;
        this.statusOrderId = response.order.statusOrder.id!;
        /*this.updateOrderForm.patchValue({
          statusOrder:  this.statusOrderId
         
        });*/

        if (this.leadId && !this.isPro) {
          //si el usuario es cliente, revisamos los pro que ya tienen esa orden
          this.checkUsersPro(this.leadId)
        }
        else{
          this.updateOrderForm.patchValue({
            statusOrder:  this.statusOrderId
          
          });
        }
      },
      error: (error) => console.log(error)
    });

  }
  checkUsersPro(leadId: string) {

    this.orderService.getOrderbyLeadUser(leadId).subscribe({
      next: (response) => {
        this.listOrderTemp = response.orders;

        for (let i = 0; i < this.listOrderTemp.length; i++) {

          this.listUserPro.push(
            {
              "user": this.listOrderTemp[i]['user'],
              "orderId": this.listOrderTemp[i]['id']
            }
          )
        }
        this.statusOrderArray.clear();
       
        this.listOrderTemp.forEach((order) => {
        
          this.statusOrderArray.push(
            this.fb.control(order.statusOrderId, Validators.required)
          );
        });
      
       
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

  onSubmit(orderId: string, i: number) {
  
    if (this.updateOrderForm.valid) {
      const formData = this.updateOrderForm.value;
      let data: any = {};
      //si es distinto de cero el usuario es profesional
      if(i!==0){
        const statusOrderId = formData.statusOrder[i];
        data  = {
          statusOrderId: statusOrderId
        }
      }else{
        const statusOrderId = formData.statusOrder;
        data  = {
          statusOrderId: statusOrderId
        }
      }
      
      this.orderService.updatedOrder(orderId, data).subscribe({
        next: (response) => {
        
          this.handleSuccessfulSubmission(response)
        },
        error: (error) => this.handleError(error)
      });

    }

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
    }, 3000);
  }
}
