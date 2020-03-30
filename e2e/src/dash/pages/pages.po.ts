import { browser } from 'protractor';

export class PagesPage {

  navigateTo() {
    browser.get('/dash/0/pages');
  }
}
