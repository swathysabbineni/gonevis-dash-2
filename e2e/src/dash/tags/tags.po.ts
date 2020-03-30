import { browser } from 'protractor';

export class TagsPage {

  navigateTo() {
    browser.get('/dash/0/tags');
  }
}
