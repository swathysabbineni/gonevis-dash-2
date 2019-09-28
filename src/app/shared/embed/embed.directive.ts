import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appEmbed]',
})
export class EmbedDirective {

  /**
   * Host listener which will listens to MessageEvent
   *
   * @param event The MessageEvent interface represents a message received by a target object {@see MessageEvent}
   */
  @HostListener('window:message', ['$event'])
  embedListeners(event: MessageEvent): void {
    /**
     * Check if  there is 'elementId' in event's 'data' property
     */
    if (event.data.elementId) {
      /**
       * Element with specific attribute
       */
      this.elementRef.nativeElement.querySelectorAll(`[data-embed-url='${event.data.elementId}']`).forEach(
        (element: Element): void => {
          /**
           * Update element's 'height' style property
           */
          element.setAttribute('height', `${event.data.height}px`);
        },
      );
    }
  }

  constructor(private elementRef: ElementRef) {
  }
}
