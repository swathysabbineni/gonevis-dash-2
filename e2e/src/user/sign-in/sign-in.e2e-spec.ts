import { browser, logging, ExpectedConditions } from 'protractor';
import { SignInPage } from './sign-in.po';

describe('User SignIn', () => {

  let page: SignInPage;

  beforeEach(() => {
    page = new SignInPage();
  });

  it('should sign in via username', () => {
    page.navigateTo();
    page.fillForm(SignInPage.DATA.username, SignInPage.DATA.password);
    browser.wait(ExpectedConditions.urlContains('/dash/0/main'), 5000);
  });

  it('should sign in via email', async () => {
    // Wait for username dropdown to show up
    browser.wait(ExpectedConditions.visibilityOf(page.getUserDropdown()), 5000).then(() => {
      // Sign out and user will be redirected to sign-in page again
      page.signOut();
      // Login in again but with email instead of username
      page.fillForm(SignInPage.DATA.email, SignInPage.DATA.password);
      // Should redirect to dash
      browser.wait(ExpectedConditions.urlContains('/dash/0/main'), 5000);
    });
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
  });
});
