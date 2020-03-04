import { browser } from 'protractor';

export class MediaPage {

  navigateTo() {
    browser.get('/dash/0/media');
  }
}
