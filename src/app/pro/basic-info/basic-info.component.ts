import { Component, numberAttribute, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../interface/user.interface';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    HeaderComponent,
    SidebarComponent,
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
  basicInfoForm: FormGroup;
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

    private userService: UserService
  ) {
    this.basicInfoForm = this.fb.group({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required,  Validators.pattern(/^\d{10}$/)]),
      email: new FormControl('',[ Validators.required ,Validators.email]),
    
    });
  }

  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (response) => {
        this.user = response.user;
        this.basicInfoForm.patchValue({
          firstname: this.user.firstname,
          lastname: this.user.lastname,
          phone: this.user.phone,
          email: this.user.email,
      });
        
      },
      error: (error) => {  
        console.log(error);
      }
    });
  }

  /*nextStep() {
    const formData = this.basicInfoForm.value;
    console.log(formData)
    console.log(this.basicInfoForm.get('category')?.valid )
    console.log(this.basicInfoForm.get('zipCode')?.valid )
    console.log(this.basicInfoForm.get('phone')?.valid )
    this.currentStep++;
    /*if (this.currentStep === 1 && this.basicInfoForm.get('category')?.valid && this.basicInfoForm.get('zipCode')?.valid &&
     this.basicInfoForm.get('phone')?.valid ) {
      this.currentStep++;
    } else if (this.currentStep === 2 &&  this.basicInfoForm.get('address')?.valid) {
      this.currentStep++;
    }
  }*/

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  

  onSubmit() {
    this.isLoading = true; 
    const formData = this.basicInfoForm.value;
    //this.currentStep++;
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
        next: (response) => {
          this.isLoading = false;  
          this.user = response.user;
          this.basicInfoForm.patchValue({
            firstname: this.user.firstname,
            lastname: this.user.lastname,
            phone: this.user.phone,
            email: this.user.email,
        });
        this.alertMessage = 'alert-success'
        this.backendMessage = 'User information updated successfully';
        this.isLoading = false;
        this.startAlertTimer();
        },
        error: (error) => {
          console.log(error)
          this.alertMessage = 'alert-danger'
          this.backendMessage = error.error.message;
          this.isLoading = false;
          this.startAlertTimer();
        }
      });
    }
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
