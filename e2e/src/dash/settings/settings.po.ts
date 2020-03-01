import { browser } from 'protractor';

export class SettingsPage {

  navigateTo() {
    browser.get('/dash/0/settings');
  }
}
