import { browser } from 'protractor';

export class TeamPage {

  navigateTo() {
    browser.get('/dash/0/team');
  }
}
