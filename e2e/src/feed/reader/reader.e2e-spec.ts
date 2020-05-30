import { browser, logging } from 'protractor';
import { CommonPage } from '../../common.po';
import { ReaderPage } from './reader.po';

describe('Feed Reader', (): void => {

  let page: ReaderPage;
  let commonPage: CommonPage;

  beforeAll((): void => {
    commonPage = new CommonPage();
    commonPage.signIn();
  });

  beforeEach((): void => {
    page = new ReaderPage();
  });

  it('should navigate to it', (): void => {
    commonPage.waitForSignIn().then((): void => {
      page.navigateTo();
      expect(browser.getTitle()).toContain('Explore');
    });
  });

  afterEach(async (): Promise<void> => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
  });
});
