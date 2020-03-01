import { browser, element, by, ElementFinder } from 'protractor';

export class SignInPage {

  static readonly DATA = {
    email: 'e2e@gonevis.com',
    username: 'e2e',
    password: 'password',
  };

  navigateTo(): void {
    browser.get('/user/sign-in');
  }

  fillForm(username: string, password: string): void {
    element(by.css('[formcontrolname=username]')).sendKeys(username);
    element(by.css('[formcontrolname=password]')).sendKeys(password);
    element(by.css('[type=submit]')).click();
  }

  getUserDropdown(): ElementFinder {
    return element(by.cssContainingText('span', SignInPage.DATA.username));
  }

  signOut(): void {
    this.getUserDropdown().click();
    element(by.cssContainingText('button', 'Sign Out')).click();
  }
}
