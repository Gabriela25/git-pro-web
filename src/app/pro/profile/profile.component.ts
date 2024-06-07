import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { ComunicationService } from '../../services/comunication.service';
import { AutocompleteComponent } from '../../shared/autocomplete/autocomplete.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    RouterLink,
    HeaderComponent,
    SidebarComponent,
    AutocompleteComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export default class ProfileComponent implements OnInit {
  firtsName: String = "Gabriela"
  email: String = "gabrielabarreto25@gmail.com"
  value : boolean =false;
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),


  });
  constructor(private comunication: ComunicationService) {

  }
  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.registerForm.value);
  }

  direction: string = 'Hola';
  ngOnInit() {
    console.log('entre a profile del componente')
    this.comunication.currentData.subscribe(direction => {
      console.log('esperando el valor del componente')
      console.log(direction)
      this.direction = direction;
      //this.comunication.triggerDirection().pipe(catchError(() => EMPTY)
    })

  }
  viewMaps(value: boolean) {
   this.value = value 
  }
}
