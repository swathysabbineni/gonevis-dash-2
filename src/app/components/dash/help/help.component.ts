import { Component } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faDiscord } from '@fortawesome/free-brands-svg-icons/faDiscord';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons/faCheckCircle';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent {

  /**
   * Icons
   */
  readonly checkCircle: IconDefinition = faCheckCircle;
  readonly discord: IconDefinition = faDiscord;
}
