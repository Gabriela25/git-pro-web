import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../shared/modal/modal.component';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interface/order.interface';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    HeaderComponent,
    ModalComponent
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export default class GetOrdersComponent {
  orders: Array<Order> = [];
  urlUploads: string = environment.urlUploads;
  messageLead!: SafeHtml | string;
  title: string = '';
  @ViewChild('modal') modal!: ModalComponent;
  isPro: boolean = false;
  page: number = 1;
  pageSize: number = 10;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService,
  ) {

  }
  ngOnInit(): void {
    this.authService.user$.subscribe((data: any) => {
      
      if (data) {
        this.isPro = data.isPro || false;
      }
    });
    this.checkOrders();
    
  }
  checkOrders() {
    //ordenamos descendente
    if (this.isPro) {
      
      this.orderService.getOrderUser().subscribe({
        next: (response) => {
         
         console.log(response.orders)
          this.orders = response.orders.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });

        },
        error: (error) => console.error(error)
      });
    }else{
      
      this.orderService.getOrderUserCustomer().subscribe({
        next: (response) => {
          
          this.orders = response.orders.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });
          
        },
        error: (error) => console.error(error)
      });
    }
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
  orderDetail(id: string) {
    this.router.navigate([`/pro/orders/detail/${id}`]);
  }


}
