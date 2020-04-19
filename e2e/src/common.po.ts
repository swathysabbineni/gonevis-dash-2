import { browser, element, by, ElementFinder, ExpectedConditions } from 'protractor';

export class CommonPage {

  static readonly DATA = {
    user: {
      email: 'e2e@gonevis.com',
      username: 'e2e',
      password: 'password',
    },
  };

  getUserDropdown(): ElementFinder {
    return element(by.id('user-dropdown'));
  }

  signOut(): void {
    this.getUserDropdown().isPresent().then((exists: boolean) => {
      if (exists) {
        this.getUserDropdown().click();
        element(by.cssContainingText('button', 'Sign Out')).click();
      }
    });
  }

  signIn(): void {
    this.signOut();
    browser.get('/user/sign-in');
    element(by.css('[formcontrolname=username]')).sendKeys(CommonPage.DATA.user.username);
    element(by.css('[formcontrolname=password]')).sendKeys(CommonPage.DATA.user.password);
    element(by.css('[type=submit]')).click();
  }

  waitForSignIn() {
    return browser.wait(ExpectedConditions.visibilityOf(this.getUserDropdown()), 5000);
  }
}
