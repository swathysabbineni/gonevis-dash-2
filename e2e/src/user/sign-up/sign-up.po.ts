import { browser } from 'protractor';

export class SignUpPage {
  navigateTo() {
    return browser.get('/user/sign-up');
  }
}
