import { FocusableOption } from '@angular/cdk/a11y';
import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[appFocusableOption]',
})
export class FocusableOptionDirective implements FocusableOption {

  /**
   * Bind 'role' attribute with value of 'list-item'
   */
  @HostBinding('attr.role') role = 'list-item';

  constructor(private elementRef: ElementRef) {
  }

  /**
   * Set focus on host element
   */
  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}
