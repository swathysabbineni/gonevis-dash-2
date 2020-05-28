import { browser } from 'protractor';

export class ReaderPage {

  navigateTo(): void {
    browser.get('/feed/explore');
  }
}
