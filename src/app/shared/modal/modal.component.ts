import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() title!: string;
  @Input() contentTemplate!: TemplateRef<any>;
  @Input() contentContext: any;

  @Output() confirmAction = new EventEmitter<void>();


  isOpen : boolean = false;
  @Input() isSelected : boolean = false;
  constructor(
    private sanitizer: DomSanitizer,
    private location: Location
  ) {}

  open() {
   
    this.isOpen = true;
  } 

  close() {
    this.isOpen = false;
    this.location.back();
  }
  onConfirm() {
    this.confirmAction.emit();
    this.isOpen = false;

  }
}
