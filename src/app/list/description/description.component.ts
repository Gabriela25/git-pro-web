import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-description-customer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './description.component.html',
  styleUrl: './description.component.css'
})
export class DescriptionComponent {
  isValidDescription: boolean= false;
  descriptionForm = new FormGroup({
    description: new FormControl('', [Validators.required]),

  });
  constructor(private route: Router
    
  
  ){

  }
  ngOnInit(): void {
    // Obtener el ID del servicio desde la URL
    
  }

  
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.descriptionForm.value.description);
    this.isValidDescription = true;
    this.onValueDescription(this.isValidDescription)
    this.route.navigate(['/']);
  }
  @Output() isDescriptionOut = new EventEmitter<any>();

  onValueDescription(value: boolean) {
    
    this.isDescriptionOut.emit(value);
  }
}
