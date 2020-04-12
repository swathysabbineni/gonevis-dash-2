import { Component } from '@angular/core';
import { FeedbackModalComponent } from '@app/shared/feedback-modal/feedback-modal.component';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent {

  readonly checkCircle: IconDefinition = faCheckCircle;
  readonly discord: IconDefinition = faDiscord;

  constructor(private modalService: BsModalService) {
  }

  /**
   * Open feedback modal
   */
  feedback(): void {
    this.modalService.show(FeedbackModalComponent);
  }
}
