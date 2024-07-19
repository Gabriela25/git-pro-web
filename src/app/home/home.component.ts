import { environment } from './../../environments/environment.development';
import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MapsComponent } from '../shared/maps/maps.component';
import { Router, RouterLink } from '@angular/router';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    MapsComponent,
    
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @ViewChild(SidebarComponent) sidebar!: SidebarComponent;

  maps_key:string = environment.MAPS_KEY;
  listServices : Array<any>=[]
  /*selectServices(idService : number){
    console.log(idService)
  }*/
 constructor(
    private router: Router,
    private category: CategoryService
  ){

  
 }
 ngOnInit() {
    this.listServices = this.category.getCategory();
  }
  navigateToServices(item: any) {
    this.category.changeCategory(item)
    this.router.navigate(['/list']);
  }
}
