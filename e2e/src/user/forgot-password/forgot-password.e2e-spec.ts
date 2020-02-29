import { browser, logging } from 'protractor';
import { ForgotPasswordPage } from './forgot-password.po';

describe('User ForgotPassword', () => {

  let page: ForgotPasswordPage;

  beforeEach(() => {
    page = new ForgotPasswordPage();
  });

  it('should navigate to it', () => {
    page.navigateTo();
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
