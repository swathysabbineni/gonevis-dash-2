import { browser } from 'protractor';

export class StartPage {
  navigateTo() {
    return browser.get('/user/start');
  }
}
