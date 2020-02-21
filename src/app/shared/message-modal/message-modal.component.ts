import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

/**
 * Quick dialog style modal to show a message to the user.
 *
 * Modal title and button label are translate keys.
 * Modal messages are not translated keys so parent must provide translated text.
 */
@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
})
export class MessageModalComponent {

  @Input() readonly title;
  @Input() readonly messages: string[];
  @Input() readonly button;

  constructor(public modal: BsModalRef) {
  }
}
