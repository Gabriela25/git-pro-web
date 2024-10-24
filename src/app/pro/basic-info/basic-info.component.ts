import { Component, numberAttribute, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../interface/user.interface';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { NgxMaskDirective } from 'ngx-mask';
import { AuthService } from '../../services/auth.service';
import { SocketComponent } from "../../shared/socket/socket.component";

@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    NgxMaskDirective,
    HeaderComponent,
    SidebarComponent,
    SocketComponent
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
  user: User = {
    id:'',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    profile:  {
      id:'',
      categories:[],
      zipcodeId: '',
      address: '',
      imagePersonal: '',
      introduction: '',
    
      isBusiness:false,
      available:true
    }
  }
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.initializebasicInfoForm();
    
  }
  
  ngOnInit(): void {
    this.checkUser()
  }
  
  initializebasicInfoForm(){
    this.basicInfoForm = this.fb.group({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required,  Validators.pattern(/^\d{10}$/)]),
      email: new FormControl('',[ Validators.required ,Validators.email]),
    
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
  }
  populateUser(user: User){
      this.basicInfoForm.patchValue({
        firstname: user.firstname,
        lastname: user.lastname,
        phone: user.phone,
        email: user.email,
    });
  }
 
  onSubmit() {
    this.isLoading = true; 
    const formData = this.basicInfoForm.value;
    if (this.basicInfoForm.valid) {
      const user: User = {
        firstname: formData.firstname || [],
        lastname: formData.lastname || '',
        phone: formData.phone || '',
        email: formData.email || '',
        enabled:true,
        profile:  {
          id:'',
          categories:[],
          zipcodeId: '',
          address: '',
          imagePersonal: '',
          introduction: '',
          isBusiness:false
        }
      };
      this.userService.putMe(user).subscribe({
        next: (response) =>{
          this.handleSuccessfulSubmission(response)
          
          this.authService.updateUser('name', `${response.user.firstname}  ${response.user.lastname}` );
          this.authService.updateUser('email', `${response.user.email} ` );
        },
        error: (error) => this.handleError(error)
      });
    }
  }
  handleSuccessfulSubmission(response: any) {
    this.alertMessage = 'alert-success';
    this.backendMessage = response.message || 'Profile updated successfully';
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
