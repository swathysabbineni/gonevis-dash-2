import { browser } from 'protractor';

export class PostsPage {

  navigateTo() {
    browser.get('/dash/0/posts');
  }
}
