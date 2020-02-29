import { browser, logging } from 'protractor';
import { SignInPage } from './sign-in.po';

describe('User SignUp', () => {

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
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
