import { Component } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';

@Component({
  selector: 'app-permission-access',
  templateUrl: './permission-access.component.html',
})
export class PermissionAccessComponent {

  /**
   * Danger icon
   */
  faExclamationTriangle: IconDefinition = faExclamationTriangle;
}
