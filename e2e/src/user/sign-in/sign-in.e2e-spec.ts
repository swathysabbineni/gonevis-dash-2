import { browser, logging, ExpectedConditions } from 'protractor';
import { SignInPage } from './sign-in.po';

describe('User SignIn', () => {

  let page: SignInPage;

  beforeEach(() => {
    page = new SignInPage();
  });

  it('should navigate to it', () => {
    page.navigateTo();
  });

  it('should sign in', () => {
    page.navigateTo();
    page.fillForm();
    browser.wait(ExpectedConditions.urlContains('/dash/0/main'), 5000);
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
