import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-display',
  standalone: true,
  imports: [],
  templateUrl: './text-display.component.html',
  styleUrl: './text-display.component.css'
})
export class TextDisplayComponent {
  @Input() message: string = '';
}
