import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {

  /**
   * Page tabs
   */
  readonly tabs: string[] = [
    'general',
    'appearance',
    'advanced',
    'upgrade',
    'billing',
  ];

  /**
   * Selected tab
   */
  tabSelected = this.tabs[0];

  constructor(private translate: TranslateService) {
  }
}
