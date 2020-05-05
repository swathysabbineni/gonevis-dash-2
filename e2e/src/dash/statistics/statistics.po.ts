import { browser } from 'protractor';

export class StatisticsPage {

  navigateTo() {
    browser.get('/dash/0/statistics');
  }
}
