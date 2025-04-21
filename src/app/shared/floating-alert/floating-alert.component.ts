import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-floating-alert',
  standalone: true,
  imports: [],
  templateUrl: './floating-alert.component.html',
  styleUrl: './floating-alert.component.css'
})
export class FloatingAlertComponent {
  @Input() alertMessage = 'alert-success'; 
  @Input() backendMessage = '';

  alertTimeout: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['backendMessage'] && this.backendMessage) {
      this.startAlertTimer();
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
