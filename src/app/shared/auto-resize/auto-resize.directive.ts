import { Directive, ElementRef, Optional, HostListener } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appAutoResize]',
})
export class AutoResizeDirective {

  /**
   * On input type event
   */
  @HostListener('input', ['$event'])
  onInput(): void {
    this.resize();
  }

  /**
   * On window resize event
   */
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.resize();
  }

  constructor(public el: ElementRef, @Optional() public ngModel: NgModel) {
    this.resize();
  }

  /**
   * Auto resize textarea
   */
  resize(): void {
    /**
     * Set element's height to auto
     */
    this.el.nativeElement.style.height = 'auto';
    /**
     * Store element's height
     */
    const height: number = this.el.nativeElement.scrollHeight;
    /**
     * Check if input has height
     */
    if (height > 0) {
      this.el.nativeElement.style.height = `${height}px`;
    }
  }
}
