import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[noWhitespace]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: NoWhitespaceDirective, multi: true }
  ],
  standalone: true 
})
export class NoWhitespaceDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const whitespace = value !== value.trim();
    return whitespace   ? { noWhitespace: true } : null;
  }
}
