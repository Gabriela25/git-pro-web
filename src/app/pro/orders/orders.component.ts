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
import { PaginationComponent } from '../../shared/pagination/pagination.component';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    HeaderComponent,
    ModalComponent,
    PaginationComponent
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export default class GetOrdersComponent {
  orders: Array<Order> = [];
  //urlUploads: string = environment.urlUploads;
  messageLead!: SafeHtml | string;
  title: string = '';
  @ViewChild('modal') modal!: ModalComponent;
  isPro: boolean = false;
  
  total: number = 0;
  page: number = 1;
  limit: number = 10;
  lastPage: number = 1;
  
  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService,
  ) {

  }
  ngOnInit(): void {

    this.getOrders(this.page);
    
  }
  getOrders(page: number) {
  
      this.page = page;
      this.orderService.getOrderUser(this.page, this.limit).subscribe({
        next: (response) => {
         
         
          this.orders = response.orders;
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
  orderDetail(id: string) {
    this.router.navigate([`/pro/orders/detail/${id}`]);
  }

  onPageChange(newPage: number) {
    this.getOrders(newPage);
  }
}
