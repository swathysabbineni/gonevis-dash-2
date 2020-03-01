import { browser, logging, ExpectedConditions } from 'protractor';
import { CommonPage } from '../../../common.po';
import { PasswordPage } from './password.po';

describe('User Settings Password', () => {

  let page: PasswordPage;
  let commonPage: CommonPage;

  beforeAll(() => {
    commonPage = new CommonPage();
    commonPage.signIn();
  });

  beforeEach(() => {
    page = new PasswordPage();
  });

  it('should navigate to it', () => {
    commonPage.waitForSignIn().then(() => {
      page.navigateTo();
      expect(page.getHeadingText()).toBe('CHANGE PASSWORD');
    });
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
  });
});
