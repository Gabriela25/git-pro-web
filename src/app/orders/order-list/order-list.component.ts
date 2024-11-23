import { Component, ViewChild } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { Order } from '../../interface/order.interface';
import { OrderList } from '../../interface/order-list.interface';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ModalComponent
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export default class OrderListComponent {
  orderList: Array<OrderList> =[];
  urlUploads: string = environment.urlUploads;
  messageOrder!: SafeHtml | string;
  title: string ='';
  @ViewChild('modal') modal!: ModalComponent;
  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private orderService: OrderService
  ){

  }
  ngOnInit(): void {
 
    this.checkOrders();
  }

  checkOrders(){
    this.orderService.getOrders().subscribe({
      next: (response) => {
        this.orderList = response.orders
        console.log(this.orderList)
      },
      error: (error) => console.error(error)
    });
  }
  showImage(urlImage: string){
    this.messageOrder = this.sanitizer.bypassSecurityTrustHtml(`
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
  orderDetail(id:string){
    this.router.navigate([`/orders/detail/${id}`]);
  }
}
