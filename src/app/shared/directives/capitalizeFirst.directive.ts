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
    return value.replace(/\b\w/g, first => first.toUpperCase());
  }
}
