import { browser } from 'protractor';

export class NavigationPage {

  navigateTo() {
    browser.get('/dash/0/navigation');
  }
}
