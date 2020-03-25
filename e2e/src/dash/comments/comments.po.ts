import { browser } from 'protractor';

export class CommentsPage {

  navigateTo() {
    browser.get('/dash/0/comments');
  }
}
