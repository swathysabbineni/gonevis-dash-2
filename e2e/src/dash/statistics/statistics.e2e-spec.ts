import { browser, logging } from 'protractor';
import { CommonPage } from '../../common.po';
import { StatisticsPage } from './statistics.po';

describe('Dash Statistics', () => {

  let page: StatisticsPage;
  let commonPage: CommonPage;

  beforeAll(() => {
    commonPage = new CommonPage();
    commonPage.signIn();
  });

  beforeEach(() => {
    page = new StatisticsPage();
  });

  it('should navigate to it', () => {
    commonPage.waitForSignIn().then(() => {
      page.navigateTo();
      expect(browser.getTitle()).toContain('Statistics');
    });
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
  });
});
