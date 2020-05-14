import { FocusKeyManager } from '@angular/cdk/a11y';
import {
  Component,
  AfterContentInit,
  ContentChildren,
  QueryList,
  HostBinding,
  HostListener,
  Output,
  EventEmitter, Input,
} from '@angular/core';
import { FocusableOptionDirective } from '@app/components/dash/write/core/focusable-option.directive';

@Component({
  selector: 'app-key-manager',
  template: '<ng-content></ng-content>',
})
export class KeyManagerComponent implements AfterContentInit {

  /**
   * Allowed keys
   */
  private allowedKeys: string[] = ['Tab', 'Enter', 'Space', 'ShiftLeft', 'ShiftRight'];

  /**
   * Bind 'role' attribute with value of 'list'
   */
  @HostBinding('attr.role') private readonly role: 'list' = 'list';

  @Input() stripArrowKeys: boolean;

  /**
   * Emit {@link KeyboardEvent} synchronously or asynchronously, and register handlers it
   * by subscribing to an instance.
   *
   * This emitter gets triggered whenever user is writing when switching between {@link FocusableOptionDirective}
   */
  @Output() blackListKeydown: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  /**
   * FocusKeyManager instance
   *
   * @see FocusKeyManager
   */
  private focusKeyManager: FocusKeyManager<FocusableOptionDirective>;

  /**
   * Query all child elements
   */
  @ContentChildren(FocusableOptionDirective) items: QueryList<FocusableOptionDirective>;

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this.allowedKeys.includes(event.code)) {
      this.focusKeyManager.onKeydown(event);
    } else {
      this.blackListKeydown.emit(event);
    }
  }

  ngAfterContentInit(): void {
    /**
     * Instantiate FocusKeyManager and enable wrapping and configures the key manager to move the selection horizontally
     */
    this.focusKeyManager = new FocusKeyManager(this.items)
      .withWrap()
      .withHorizontalOrientation('ltr');
    /**
     * Strip arrow keys if condition was given
     */
    if (!this.stripArrowKeys) {
      this.allowedKeys.push('ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft');
    }
  }

  /**
   * Sets the active item to the item at the specified index and focuses the newly active item.
   *
   * @param index Index of the item to be set as active.
   */
  setActiveItem(index: number): void {
    this.focusKeyManager.setActiveItem(index);
  }
}
