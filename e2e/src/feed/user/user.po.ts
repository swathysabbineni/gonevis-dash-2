import { CommonPage } from '../../common.po';
import { browser } from 'protractor';

export class UserPage {

  static readonly DATA = CommonPage.DATA.user;

  navigateTo(): void {
    browser.get(`/feed/user/${UserPage.DATA.username}`);
  }
}
