import { browser, logging } from 'protractor';
import { PasswordPage } from './password.po';

describe('User Settings Password', () => {

  let page: PasswordPage;

  beforeEach(() => {
    page = new PasswordPage();
  });

  it('should navigate to it', () => {
    page.navigateTo();
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
  });
});
