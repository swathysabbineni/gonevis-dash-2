import { browser } from 'protractor';

export class MainPage {

  navigateTo() {
    browser.get('/dash/0/main');
  }
}
