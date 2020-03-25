import { browser } from 'protractor';

export class NavsPage {

  navigateTo() {
    browser.get('/dash/0/navs');
  }
}
