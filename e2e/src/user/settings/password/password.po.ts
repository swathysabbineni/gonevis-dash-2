import { browser } from 'protractor';

export class PasswordPage {
  navigateTo() {
    return browser.get('/user/profile/password');
  }
}
