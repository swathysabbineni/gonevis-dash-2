import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {

  /**
   * Page tabs
   * Tab names will be converted to uppercase and used as translation keys in view.
   */
  readonly tabs: string[] = [
    'general',
    'appearance',
    'advanced',
    'upgrade',
    'billing',
  ];
}
