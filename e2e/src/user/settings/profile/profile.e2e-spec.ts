import { browser, logging } from 'protractor';
import { CommonPage } from '../../../common.po';
import { ProfilePage } from './profile.po';

describe('User Settings Profile', () => {

  let page: ProfilePage;
  let commonPage: CommonPage;

  beforeAll(() => {
    commonPage = new CommonPage();
    commonPage.signIn();
  });

  beforeEach(() => {
    page = new ProfilePage();
  });

  it('should navigate to it', () => {
    commonPage.waitForSignIn().then(() => {
      page.navigateTo();
      expect(page.getHeadingText()).toBe('USER SETTINGS');
    });
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
  });
});
