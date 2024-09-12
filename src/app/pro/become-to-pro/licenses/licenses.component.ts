import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-licenses',
  standalone: true,
  imports: [
    TranslateModule,
  ],
  templateUrl: './licenses.component.html',
  styleUrl: './licenses.component.css'
})
export class LicensesComponent {
  @Output() dataEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  closeLicenses(licenses: boolean){
    this.dataEmitter.emit(licenses)
  }
}
