import { CommonModule } from '@angular/common';
import { Component, numberAttribute, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../interface/user.interface';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../../services/auth.service';
import { SocketComponent } from "../../shared/socket/socket.component";
import { CapitalizeFirstDirective } from '../../shared/directives/capitalize-first.directive';
import { NoWhitespaceDirective } from '../../shared/directives/no-whitespace';
import { ServiceWorkersService } from '../../services/service-workers.service';
import { Notification } from '../../interface/notification.interface';
import { ModalComponent } from '../../shared/modal/modal.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FloatingAlertComponent } from '../../shared/floating-alert/floating-alert.component';

@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxMaskDirective,
    HeaderComponent,
    CapitalizeFirstDirective,
    NoWhitespaceDirective,
    ModalComponent,
    FloatingAlertComponent
  ],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.css'
})
export default class BasicInfoComponent implements OnInit {

  isLoading = false;
  backendMessage = '';
  alertMessage = '';
  alertTimeout: any;
  token: string = '';
  basicInfoForm!: FormGroup;
  currentStep: number = 1;
  statusWindowNotification = '';
  allowNotificationsControl = new FormControl(false);
  @ViewChild('modal') modal!: ModalComponent;
  bodyModal!: SafeHtml | string;
  title: string = 'Enable Notifications in Your Browser';
  user: User = {
    id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    profile: {
      id: '',
      categories: [],
      zipcodeId: '',
      address: '',
      imagePersonal: '',
      introduction: '',
      isBusiness: false,
      available: true
    }
  }

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

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private authService: AuthService,
    private serviceWorkersService: ServiceWorkersService
  ) {
    this.initializebasicInfoForm();

  }

  ngOnInit(): void {
    this.checkUser()
    this.statusWindowNotification = this.serviceWorkersService.getPushNavigatorStatus()!;
  }

  initializebasicInfoForm() {
    this.basicInfoForm = this.fb.group({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),

    });
  }
  checkUser() {
    this.userService.getMe().subscribe({
      next: (response) => {
        console.log(response)
        this.populateUser(response.user)
      },
      error: (error) => console.error(error)
    });
    this.allowNotificationsControl.valueChanges.subscribe(value => {
      this.onCheckboxChange(value!);
    });

  }
  populateUser(user: User) {
    this.basicInfoForm.patchValue({
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
    });
    this.serviceWorkersService.getStatusByUser().subscribe({
      next: (response) => {
        this.notification = response.notification;
        this.getPushNavigatorStatus();
      },
      error: (error) => {
      }
    });
  }


  onSubmit() {
    this.basicInfoForm.markAllAsTouched();
    if (this.basicInfoForm.invalid) {
      return;
    } else {
      this.isLoading = true;
      const formData = this.basicInfoForm.value;
      const user: User = {
        firstname: formData.firstname || [],
        lastname: formData.lastname || '',
        phone: formData.phone || '',
        email: formData.email || '',
        enabled: true,
        profile: {
          id: '',
          categories: [],
          zipcodeId: '',
          address: '',
          imagePersonal: '',
          introduction: '',
          isBusiness: false
        }
      };
      this.userService.putMe(user).subscribe({
        next: (response) => {
          this.handleSuccessfulSubmission(response)

          this.authService.updateUser('name', `${response.user.firstname}  ${response.user.lastname}`);
          this.authService.updateUser('email', `${response.user.email} `);
        },
        error: (error) => this.handleError(error)
      });
    }
  }

  getPushNavigatorStatus() {
    if (this.statusWindowNotification) {

      if (this.statusWindowNotification === 'denied' || this.statusWindowNotification === 'default') {
        this.allowNotificationsControl.setValue(false);
      }
      else if (this.statusWindowNotification === 'granted') {
        this.serviceWorkersService.getSubscriptionActive(). then(subscription => {  
          if (subscription === 'subscribed') {
            this.allowNotificationsControl.setValue(true);
          } 
          else{
            this.allowNotificationsControl.setValue(false);
          }      
       
        })
      }
    }
  }
  onCheckboxChange(isChecked: boolean) {
   
    if (isChecked) {
      if (this.statusWindowNotification === 'default' && this.notification.userId === "") {

        this.subscribeToPushNotifications();
      }
      if (this.statusWindowNotification === 'default' && this.notification.userId != "") {
        this.serviceWorkersService.removeNotification(this.notification.id!).subscribe({
          next: (response) => {
            if (response.message) {
              this.subscribeToPushNotifications();
            }
          },
          error: (error) => {

          }
        })

      }
      else if (this.statusWindowNotification === 'denied') {
        this.modalInformation()
        //enviar modal para opciones de habilitar manualmente

      }
      else if (this.statusWindowNotification === 'granted') {
        this.serviceWorkersService.getSubscriptionActive(). then(subscription => {  
          if (subscription != 'subscribed') {
            this.serviceWorkersService.removeNotification(this.notification.id!).subscribe({
              next: (response) => {
                if (response.message) {
                  this.subscribeToPushNotifications();
                }
              },
              error: (error) => {
    
              }
            })
          } 
       
        })
      }

    }
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

  modalInformation() {
    this.bodyModal = this.sanitizer.bypassSecurityTrustHtml(`
      <div id="enable-notifications">
        <ul>
              <li><strong>Google Chrome:</strong>
                  <ol>
                      <li>Open <strong>Chrome</strong> and visit the website.</li>
                      <li>Click the <strong>lock icon 🔒</strong> in the address bar.</li>
                      <li>Find <strong>Notifications</strong> and select <strong>"Allow"</strong>.</li>
                      <li>Reload the page to apply changes.</li>
                  </ol>
                  <p><a href="chrome://settings/content/notifications" target="_blank">Open Chrome Notification Settings</a></p>
              </li>
              <li><strong>Mozilla Firefox:</strong>
                  <ol>
                      <li>Open <strong>Firefox</strong> and visit the website.</li>
                      <li>Click the <strong>lock icon 🔒</strong> in the address bar.</li>
                      <li>If <strong>"Send notifications"</strong> appears, change it to <strong>"Allow"</strong>.</li>
                      <li>If not, go to <strong>Settings → Privacy & Security → Permissions → Notifications</strong>.</li>
                      <li>Find the website and change it to <strong>"Allow"</strong>.</li>
                  </ol>
                  <p><a href="about:preferences#privacy" target="_blank">Open Firefox Notification Settings</a></p>
              </li>
          </ul>
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
  handleSuccessfulSubmission(response: any) {
    this.alertMessage = 'alert-success';
    this.backendMessage = response.message || 'Profile updated successfully';
    this.isLoading = false;
  }

  handleError(error: any) {
    this.alertMessage = 'alert-danger';
    this.backendMessage = error.error.message || 'An error occurred';
    this.isLoading = false;
   
  }
  


}
