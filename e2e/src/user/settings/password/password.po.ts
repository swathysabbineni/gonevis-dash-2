import { browser, element, by } from 'protractor';

export class PasswordPage {

  navigateTo() {
    browser.get('/user/setting/password');
  }

  getHeadingText() {
    return element(by.css('h4')).getText();
  }
}
