import { KeyValue } from '@angular/common';
import { Component, EventEmitter, OnDestroy, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { KeyboardShortcuts } from '@app/interfaces/keyboard-shortcuts';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faBold } from '@fortawesome/free-solid-svg-icons';
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons/faAlignCenter';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons/faAlignJustify';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons/faAlignLeft';
import { faAlignRight } from '@fortawesome/free-solid-svg-icons/faAlignRight';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { faCut } from '@fortawesome/free-solid-svg-icons/faCut';
import { faFont } from '@fortawesome/free-solid-svg-icons/faFont';
import { faHeading } from '@fortawesome/free-solid-svg-icons/faHeading';
import { faIndent } from '@fortawesome/free-solid-svg-icons/faIndent';
import { faItalic } from '@fortawesome/free-solid-svg-icons/faItalic';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import { faListOl } from '@fortawesome/free-solid-svg-icons/faListOl';
import { faListUl } from '@fortawesome/free-solid-svg-icons/faListUl';
import { faOutdent } from '@fortawesome/free-solid-svg-icons/faOutdent';
import { faPaste } from '@fortawesome/free-solid-svg-icons/faPaste';
import { faQuoteRight } from '@fortawesome/free-solid-svg-icons/faQuoteRight';
import { faRedo } from '@fortawesome/free-solid-svg-icons/faRedo';
import { faRemoveFormat } from '@fortawesome/free-solid-svg-icons/faRemoveFormat';
import { faStrikethrough } from '@fortawesome/free-solid-svg-icons/faStrikethrough';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faUnderline } from '@fortawesome/free-solid-svg-icons/faUnderline';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.scss'],
})
export class ShortcutsComponent implements OnDestroy {

  readonly faTimes: IconDefinition = faTimes;

  /**
   * Determines whether or not modal is closed.
   */
  readonly modalClosed: EventEmitter<void> = new EventEmitter<void>();

  /*
   * An unmodifiable list of items that Angular keeps up to date when the state
   * of the application changes. In this case the items are list of shortcut groups.
   */
  @ViewChildren('group') groupQueryList: QueryList<ElementRef<HTMLElement>>;

  /**
   * List of available keyboard shortcuts which are grouped by a unique label.
   */
  readonly shortcuts: Map<string, KeyboardShortcuts[]> = new Map<string, KeyboardShortcuts[]>([
    [
      'TEXT_FORMATTING',
      [{
        icon: faBold,
        name: 'BOLD',
        keys: ['Ctrl', 'B'],
      }, {
        icon: faItalic,
        name: 'ITALIC',
        keys: ['Ctrl', 'I'],
      }, {
        icon: faUnderline,
        name: 'UNDERLINE',
        keys: ['Ctrl', 'U'],
      }, {
        icon: faStrikethrough,
        name: 'STRIKETHROUGH',
        keys: ['Alt', 'Shift', '5'],
      }, {
        icon: faRemoveFormat,
        name: 'CLEAR_FORMATTING',
        keys: ['Ctrl', '/'],
      }],
    ],
    [
      'PARAGRAPH_FORMATTING',
      [{
        icon: faFont,
        name: 'APPLY_NORMAL_TEXT',
        keys: ['Ctrl', 'Alt', '0'],
      }, {
        icon: faHeading,
        name: 'APPLY_HEADING_1',
        keys: ['Ctrl', 'Alt', '1'],
      }, {
        icon: faHeading,
        name: 'APPLY_HEADING_2',
        keys: ['Ctrl', 'Alt', '2'],
      }, {
        icon: faHeading,
        name: 'APPLY_HEADING_3',
        keys: ['Ctrl', 'Alt', '3'],
      }, {
        icon: faHeading,
        name: 'APPLY_HEADING_4',
        keys: ['Ctrl', 'Alt', '4'],
      }, {
        icon: faHeading,
        name: 'APPLY_HEADING_5',
        keys: ['Ctrl', 'Alt', '5'],
      }, {
        icon: faHeading,
        name: 'APPLY_HEADING_6',
        keys: ['Ctrl', 'Alt', '6'],
      }, {
        icon: faAlignLeft,
        name: 'LEFT_ALIGN_TEXT',
        keys: ['Ctrl', 'Shift', 'L'],
      }, {
        icon: faAlignCenter,
        name: 'CENTER_ALIGN_TEXT',
        keys: ['Ctrl', 'Shift', 'E'],
      }, {
        icon: faAlignRight,
        name: 'RIGHT_ALIGN_TEXT',
        keys: ['Ctrl', 'Shift', 'R'],
      }, {
        icon: faAlignJustify,
        name: 'JUSTIFY_TEXT',
        keys: ['Ctrl', 'Shift', 'J'],
      }, {
        icon: faIndent,
        name: 'INCREASE_INDENT',
        keys: ['Ctrl', ']'],
      }, {
        icon: faOutdent,
        name: 'DECREASE_INDENT',
        keys: ['Ctrl', '['],
      }, {
        icon: faListOl,
        name: 'TOGGLE_NUMBERED_LIST',
        keys: ['Ctrl', 'Shift', '7'],
      }, {
        icon: faListUl,
        name: 'TOGGLE_BULLETED_LIST',
        keys: ['Ctrl', 'Shift', '8'],
      }, {
        icon: faQuoteRight,
        name: 'TOGGLE_BLOCKQUOTE',
        keys: ['Ctrl', 'Shift', '9'],
      }],
    ],
    [
      'EDITING',
      [{
        icon: faLink,
        name: 'INSERT_LINK',
        keys: ['Ctrl', 'K'],
      }, {
        icon: faCut,
        name: 'CUT',
        keys: ['Ctrl', 'X'],
      }, {
        icon: faCopy,
        name: 'COPY',
        keys: ['Ctrl', 'C'],
      }, {
        icon: faPaste,
        name: 'PASTE',
        keys: ['Ctrl', 'V'],
      }, {
        icon: faFont,
        name: 'PASTE_WITHOUT_FORMATTING',
        keys: ['Ctrl', 'Shift', 'V'],
      }, {
        icon: faUndo,
        name: 'UNDO',
        keys: ['Ctrl', 'Z'],
      }, {
        icon: faRedo,
        name: 'REDO',
        keys: ['Ctrl', 'Y'],
      }],
    ],
  ]);

  /**
   * Current viewing group which is used for indicating left panel items that are responsible
   * for scrolling to shortcut groups.
   */
  currentGroup = 'TEXT_FORMATTING';

  constructor(public modalRef: BsModalRef) {
  }

  /**
   * Keep original order of shortcut groups
   *
   * @param a Key-value object
   * @param b Kay-value object
   *
   * @returns Zero to keep original order
   */
  originalOrder(a: KeyValue<string, KeyboardShortcuts[]>, b: KeyValue<string, KeyboardShortcuts[]>): 0 {
    return 0;
  }

  /**
   * Scroll to a specific shortcut group based on given group name.
   *
   * @param groupName Group name to scroll to
   */
  scrollToGroup(groupName: string): void {
    const group: ElementRef<HTMLElement> = this.groupQueryList.find((elementRef: ElementRef<HTMLElement>): boolean => {
      return elementRef.nativeElement.getAttribute('group-name') === groupName;
    });
    // In case if element was not found.
    if (group) {
      group.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * On shortcuts scroll, get currently viewing group.
   * This is being used to indicate the left panel that has list of shortcut groups.
   *
   * @param event Event
   */
  onScroll(event: Event): void {
    const target: HTMLElement = event.target as HTMLElement;
    // Get current shortcut group element that has been passed by scroller.
    const passedElement: ElementRef<HTMLElement> = this.groupQueryList.filter(
      (elementRef: ElementRef<HTMLElement>): boolean => target.scrollTop >= elementRef.nativeElement.offsetTop,
    ).pop();
    // In case if no element have been passed by scroll, break the code to prevent errors.
    if (!passedElement) {
      return;
    }
    // Set passed element as currently viewing group.
    this.currentGroup = passedElement.nativeElement.getAttribute('group-name');
    // If scroll reached the end then mark the last shortcut group as selected.
    if (target.scrollHeight - target.scrollTop < target.clientHeight) {
      this.currentGroup = this.groupQueryList.last.nativeElement.getAttribute('group-name');
    }
  }

  ngOnDestroy(): void {
    // Notify listeners that this modal is closed.
    this.modalClosed.emit();
  }
}
