import { browser, element, by } from 'protractor';

export class SignInPage {

  private static readonly CREDENTIALS = {
    email: 'e2e@gonevis.com',
    username: 'e2e',
    password: 'password',
  };

  navigateTo() {
    return browser.get('/user/sign-in');
  }

  fillForm(credentials = SignInPage.CREDENTIALS) {
    element(by.css('[formcontrolname=username]')).sendKeys(credentials.username);
    element(by.css('[formcontrolname=password]')).sendKeys(credentials.password);
    element(by.css('[type=submit]')).click();
  }
}
