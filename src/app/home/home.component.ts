import { environment } from './../../environments/environment';
import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
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
import { ServiceWorkersService } from '../services/service-workers.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { Notification } from '../interface/notification.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    HeaderComponent,
    FooterComponent,
    ModalComponent

  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {
  //@ViewChild(SidebarComponent) sidebar!: SidebarComponent;
  @ViewChild('modal') modal!: ModalComponent;
  nameUser: string = '';
  maps_key: string = environment.MAPS_KEY;
  listCategories: Array<any> = []
  title: string = '';
  bodyModal!: SafeHtml | string;
  statusWindowNotification = '';
  notification: Notification = {

    userId: '',
    user: {
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
    },
    permission: '',
    device: ''
  }
  //sanitizer: any;
  /*selectServices(idService : number){
    console.log(idService)
  }*/
  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    private category: CategoryService,
    private authService: AuthService,
    private leadService: LeadService,
    private serviceWorkersService: ServiceWorkersService
  ) {


  }
  ngOnInit(): void {
    this.category.getAllCategories().subscribe({
      next: (response) => {
        this.listCategories = response.categories;

      },
      error: (error) => {
      }
    });
    //si el usuario esta autenticado
    if (this.authService.isAuthenticated()) {
      this.serviceWorkersService.getStatusByUser().subscribe({
      next: (response) => {
        this.notification = response.notification;
       
      },
      error: (error) => {
        //quiere decir que no se ha suscripto, y que no ha rechazado previamente las notificaciones
        const rejectSubscriptions = localStorage.getItem('rejectSubscriptions');
        if(!rejectSubscriptions){
          this.modalSubscribe();   
        }
             
      }
    });
      
    }  
    /*this.serviceWorkersService.getStatusByUser().subscribe({
      next: (response) => {
        this.notification = response.notification;
        if(this.notification.userId != ""){
          this.getPushNavigatorStatus();   
        }
        
      },
      error: (error) => {
        if (this.authService.isAuthenticated()) {
              this.modalSubscribe();
        }    
         
      }
    });*/

  }
  /*ngAfterViewInit() {
    setTimeout(() => {
      this.modalSubscribe();
    });
  }*/
  navigateToServices(item: Category) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/leads/multi']);
      this.leadService.updateDataLead('categoryId', item.id);
      this.leadService.updateDataLead('categoryName', item.name);
    }
    else {
      this.router.navigate(['/auth/login']);
    }
  }

  modalSubscribe() {
    this.bodyModal = this.sanitizer.bypassSecurityTrustHtml(`
      <div>
        <div class="text-center"><i class="bi bi-bell fa" style="font-size:3em;color:#7e01e0"></i></div>
        <h5 class="p-3 text-center">Allow <strong>Fixi</strong> to send you notifications?</h5>
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
  subscribeToPushNotifications() {

    this.serviceWorkersService.subscribeToPushNotifications().subscribe({
      next: (response) => {
        console.log("Notificación push suscrita con éxito:", response);
      },
      error: (error) => {
        console.error("Error al suscribirse a notificaciones push:", error);
      }
    });
  }
  rejectSubscriptions(){
    
    localStorage.setItem('rejectSubscriptions', 'true')
  }
  getPushNavigatorStatus() {

    this.statusWindowNotification = this.serviceWorkersService.getPushNavigatorStatus()!;
    console.log('statusWindowNotification: ', this.statusWindowNotification)
    console.log('this.notification.permission: ', this.notification.permission)
    if (this.statusWindowNotification) {
      if (this.statusWindowNotification === 'default') {
        setTimeout(() => {
          this.modalSubscribe();
        }, 1000);

      }
      /*else if (this.notification.permission === 'granted' && this.statusWindowNotification === 'denied') {
        setTimeout(() => {
          this.modalSubscribe();
        }, 1000);
      }*/
    }

  }

}
