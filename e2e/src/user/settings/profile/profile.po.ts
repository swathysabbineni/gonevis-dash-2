import { browser, element, by } from 'protractor';

export class ProfilePage {

  navigateTo() {
    browser.get('/user/setting/profile');
  }

  getHeadingText() {
    return element(by.css('h4')).getText();
  }
}
