import { Directive, ElementRef, OnDestroy, Renderer2, Output, EventEmitter, Input } from '@angular/core';
import { MediaService } from '@app/components/dash/media/media.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appDragDrop]',
})
export class DragDropDirective implements OnDestroy {

  /**
   * File extension (type) whitelist
   *
   * @see File.type
   */
  @Input() accept: string;

  /**
   * An event emitter that emits list of dropped files
   * which are filtered by their [file extension whitelist]{@link accept}.
   */
  @Output() afterDrop: EventEmitter<File[]> = new EventEmitter<File[]>();

  /**
   * Represents a disposable resource, such as the execution of an Observable.
   * A subscription has one important method, `unsubscribe`, that takes no argument
   * and just disposes the resource held by the subscription.
   */
  private readonly subscription: Subscription = new Subscription();

  /**
   * Drag counter
   */
  private dragCounter = 0;

  constructor(private elementRef: ElementRef,
              private renderer2: Renderer2) {
    /**
     * List to document [drop event]{@link DragEvent}
     */
    this.subscription.add(
      this.renderer2.listen('document', 'drop', (event: DragEvent): void => {
        this.dragCounter--;

        if (event.dataTransfer.types.includes('Files')) {
          this.renderer2.removeClass(this.elementRef.nativeElement, 'drag-entered');
          this.renderer2.removeClass(this.elementRef.nativeElement, 'drag-started');
          event.preventDefault();
          /**
           * @description
           *
           * Pass files under [accept list]{@link accept} filter
           */
          const files: File[] = Array.from(event.dataTransfer.files)
            .filter((file: File): boolean => (this.accept || MediaService.acceptList.join(',')).includes(file.type));
          /**
           * Emit filtered list if at least one file passed filter
           */
          if (files.length) {
            this.afterDrop.emit(files);
          }
        }
      }),
    );
    /**
     * List to document [dragover event]{@link DragEvent}
     */
    this.subscription.add(
      this.renderer2.listen('document', 'dragover', (event: DragEvent): void => {
        event.preventDefault();
        if (event.dataTransfer.types.includes('Files') &&
          !(event.target as HTMLElement).classList.contains('drop-zone')) {
          event.dataTransfer.dropEffect = 'none';
        }
      }),
    );
    /**
     * List to document [dragenter event]{@link DragEvent}
     */
    this.subscription.add(
      this.renderer2.listen('document', 'dragenter', (event: DragEvent): void => {
        this.dragCounter++;

        if (event.dataTransfer.types.includes('Files')) {
          if (!(event.target as HTMLElement).classList.contains('drop-zone')) {
            event.dataTransfer.dropEffect = 'none';
            this.renderer2.removeClass(this.elementRef.nativeElement, 'drag-entered');
          } else {
            this.renderer2.addClass(this.elementRef.nativeElement, 'drag-entered');
          }
          this.renderer2.addClass(this.elementRef.nativeElement, 'drag-started');

          event.preventDefault();
        }
      }),
    );
    /**
     * List to document [dragleave event]{@link DragEvent}
     */
    this.subscription.add(
      this.renderer2.listen('document', 'dragleave', (): void => {
        this.dragCounter--;
        if (this.dragCounter === 0) {
          this.renderer2.removeClass(this.elementRef.nativeElement, 'drag-entered');
          this.renderer2.removeClass(this.elementRef.nativeElement, 'drag-started');
        }
      }),
    );
  }

  /**
   * A callback method that performs custom clean-up, invoked immediately
   * after a directive, pipe, or service instance is destroyed.
   */
  ngOnDestroy(): void {
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     */
    this.subscription.unsubscribe();
  }
}
