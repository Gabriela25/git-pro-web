import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { ContainerComponent } from '../../shared/container/container.component';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-phone',
  standalone: true,
  imports: [
    HeaderComponent,
    ContainerComponent
  ],
  templateUrl: './phone.component.html',
  styleUrl: './phone.component.css'
})
export default class PhoneComponent {
  label: string = 'Phone';
  idElement: string = 'phone';
  routerLink: string = '/orders/description';
  categoryName: string = '';
  constructor( private orderService: OrderService){

  }
  ngOnInit(){
    this.orderService.order$.subscribe((data: any) => {
      this.categoryName = data.categoryName
      
    }); 
  }
}
