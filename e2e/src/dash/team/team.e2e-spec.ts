import { browser, logging } from 'protractor';
import { CommonPage } from '../../common.po';
import { TeamPage } from './team.po';

describe('Dash Team', () => {

  let page: TeamPage;
  let commonPage: CommonPage;

  beforeAll(() => {
    commonPage = new CommonPage();
    commonPage.signIn();
  });

  beforeEach(() => {
    page = new TeamPage();
  });

  it('should navigate to it', () => {
    commonPage.waitForSignIn().then(() => {
      page.navigateTo();
      expect(browser.getTitle()).toContain('Team');
    });
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
  });
});
