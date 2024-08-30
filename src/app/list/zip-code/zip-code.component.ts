import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';
declare const grecaptcha: any;
@Component({
  selector: 'app-zip-code',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './zip-code.component.html',
  styleUrl: './zip-code.component.css'
})
export class ZipCodeComponent {

  zipCode: number = 0;
  nameCategory: String = '';
  isValidZipCode: boolean= false;
  categoria: {} ={};
  zipCodeForm = new FormGroup({
    zipCode: new FormControl('', [Validators.required]),


  });
  constructor(
    private route: ActivatedRoute,
    private category: CategoryService
  ){

  }
  /*ngOnInit(): void {
    // Obtener el ID del servicio desde la URL
    this.route.params.subscribe(params => {
      console.log(params)
    });
    this.category.currentCategory.subscribe(category => {
      this.nameCategory = category.name; 
       console.log(category)
      
    })
  }*/

  
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.zipCodeForm.value.zipCode);
    this.isValidZipCode = true;
    this.onValue(this.isValidZipCode)
  }
  @Input() siteKey: string ='6Lcw9wUqAAAAAMc2pVX7cv-KiQydiOtO6bfRjPtc';
  @Output() isZipCodeOut = new EventEmitter<any>();

  onValue(value: boolean) {
    console.log('llegue al evento en el hijo',value)
    this.isZipCodeOut.emit(value);
  }
  /*ngAfterViewInit() {
    grecaptcha.render('recaptcha-container', {
      'sitekey': this.siteKey
    });
  }*/
}
