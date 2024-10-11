import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.css'
})
export class ContainerComponent {

  @Input() label: string ='';
  @Input() idElement: string ='';
  @Input() routerLink: string= '';
  inputValue: string = '';
  containerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private orderService : OrderService
  ){
    this.containerForm = this.fb.group({
      inputValue: new FormControl('', [Validators.required]),
     
    });
  }
  ngOnInit(){
    this.orderService.order$.subscribe((data: any) => {
      if(this.idElement === 'zipcode'){ 
        this.inputValue = data.zipcode || ''; 
      } 
      if(this.idElement === 'phone'){
        this.inputValue = data.phone || ''; 
      }
    });  
  }
  onSubmit() {
    this.orderService.updateDataOrder(this.idElement, this.inputValue);
  }
}
