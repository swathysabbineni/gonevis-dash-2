import { browser, element, by, ElementFinder } from 'protractor';
import { CommonPage } from '../../common.po';

export class SignInPage {

  static readonly DATA = CommonPage.DATA.user;

  navigateTo(): void {
    browser.get('/user/sign-in');
  }

  fillForm(username: string, password: string): void {
    element(by.css('[formcontrolname=username]')).sendKeys(username);
    element(by.css('[formcontrolname=password]')).sendKeys(password);
    element(by.css('[type=submit]')).click();
  }
}
