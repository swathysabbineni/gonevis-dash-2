import { browser, logging } from 'protractor';
import { StartPage } from './start.po';

describe('User Start', () => {

  let page: StartPage;

  beforeEach(() => {
    page = new StartPage();
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
