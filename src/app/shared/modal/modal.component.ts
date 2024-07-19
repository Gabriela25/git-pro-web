import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() modalId: string = 'myModal';
  @Input() content: SafeHtml | null = null;
  selectedValue: string = '';

  constructor(private sanitizer: DomSanitizer){
    
  }
  isOpen = false;
  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    console.log('entre')
  }
  setContent(html: string) {
    this.content = this.sanitizer.bypassSecurityTrustHtml(html);
    console.log(this.content)
  }
 
  @Output() selectChangeOut = new EventEmitter<any>();

  onSelectChange2(event: Event) {
    console.log('llegue al evento en el hijo',event)
    this.selectChangeOut.emit(event);
  }
}
