import { browser, logging } from 'protractor';
import { SignUpPage } from './sign-up.po';

describe('User SignUp', () => {

  let page: SignUpPage;

  beforeEach(() => {
    page = new SignUpPage();
  });

  it('should navigate to it', () => {
    page.navigateTo();
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
  });
});
