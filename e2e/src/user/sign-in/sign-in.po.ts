import { browser, element, by, ElementFinder } from 'protractor';
import { CommonPo } from '../../common.po';

export class SignInPage {

  static readonly DATA = CommonPo.DATA.user;

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
