import { browser, element, by } from 'protractor';

export class CommonPo {

  static readonly DATA = {
    user: {
      email: 'e2e@gonevis.com',
      username: 'e2e',
      password: 'password',
    },
  };

  signIn(): void {
    browser.get('/user/sign-in');
    element(by.css('[formcontrolname=username]')).sendKeys(CommonPo.DATA.user.username);
    element(by.css('[formcontrolname=password]')).sendKeys(CommonPo.DATA.user.password);
    element(by.css('[type=submit]')).click();
  }
}
