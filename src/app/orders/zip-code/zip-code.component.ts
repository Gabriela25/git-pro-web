import { Component } from '@angular/core';
import { ContainerComponent } from '../../shared/container/container.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ZipcodeService } from '../../services/zipcode.service';
import { Zipcode } from '../../interface/zipcode.interface';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-zip-code',
  standalone: true,
  imports: [
    TranslateModule,
    ContainerComponent,
    HeaderComponent
  ],
  templateUrl: './zip-code.component.html',
  styleUrl: './zip-code.component.css'
})
export default class ZipCodeComponent {
  categoryName: string = "";
  label: string = 'Zipcode';
  idElement: string = 'zipcode';
  routerLink: string = '/orders/phone';
  listZipcode: Array<Zipcode> = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private zipCodeService: ZipcodeService,
    private orderService: OrderService
    
  ) {
   
  }
  ngOnInit(){
    this.zipCodeService.getAllZipcodes().subscribe({
      next: (response) => {
        console.log(response)
        this.listZipcode = response.zipcodes;

      },
      error: (error) => {
        console.log(error);
      }
    });
    this.orderService.order$.subscribe((data: any) => {
      this.categoryName = data.categoryName
     
    }); 
  }
  onSubmit(){
    this.router.navigate(['/orders/phone',]);
  }

}
