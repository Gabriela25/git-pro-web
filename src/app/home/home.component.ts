import { environment } from './../../environments/environment.development';
import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MapsComponent } from '../shared/maps/maps.component';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { AuthService } from '../services/auth.service';
import { ModalComponent } from '../shared/modal/modal.component';
import { SocketComponent } from '../shared/socket/socket.component';
import { Category } from '../interface/category.interface';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../shared/footer/footer.component";
import { LeadService } from '../services/lead.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {
  //@ViewChild(SidebarComponent) sidebar!: SidebarComponent;
  @ViewChild('modal') modal!: ModalComponent;
  nameUser:string = '';
  maps_key:string = environment.MAPS_KEY;
  listCategories: Array<any> =[]

  /*selectServices(idService : number){
    console.log(idService)
  }*/
 constructor(
    private router: Router,
    private category: CategoryService,
    private authService : AuthService,
    private leadService: LeadService
  ){

  
 }
 ngOnInit(): void {
  this.category.getAllCategories().subscribe({
    next: (response) => {
      this.listCategories = response.categories;
    },
    error: (error) => {  
     
    }
  });
  
  
  //this.listServices = this.category.getCategory();
}
  navigateToServices(item: Category) {
    if(this.authService.isAuthenticated()){
      this.router.navigate(['/leads/multi']);
      this.leadService.updateDataLead('categoryId',item.id);
      this.leadService.updateDataLead('categoryName',item.name );
    }
    else{
      this.router.navigate(['/auth/login']);     
    }
  }
  
}
