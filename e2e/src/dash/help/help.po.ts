import { browser } from 'protractor';

export class HelpPage {

  navigateTo() {
    browser.get('/dash/0/help');
  }
}
