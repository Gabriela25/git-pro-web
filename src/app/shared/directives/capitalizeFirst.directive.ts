import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCapitalizeFirst]',
  standalone: true 
})
export class CapitalizeFirstDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = this.capitalizeFirstLetter(input.value);
  }

  private capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }
}
