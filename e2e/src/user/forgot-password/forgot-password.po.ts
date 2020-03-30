import { browser } from 'protractor';

export class ForgotPasswordPage {
  navigateTo() {
    return browser.get('/user/forgot-password');
  }
}
