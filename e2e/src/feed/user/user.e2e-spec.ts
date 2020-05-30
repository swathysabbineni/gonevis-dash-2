import { browser, logging, element, by } from 'protractor';
import { CommonPage } from '../../common.po';
import { UserPage } from './user.po';

describe('Feed User', (): void => {

  let page: UserPage;
  let commonPage: CommonPage;

  beforeAll((): void => {
    commonPage = new CommonPage();
    commonPage.signIn();
  });

  beforeEach((): void => {
    page = new UserPage();
  });

  it('should navigate to it', (): void => {
    commonPage.waitForSignIn().then((): void => {
      commonPage.getUserDropdown().isPresent().then((exists: boolean): void => {
        if (exists) {
          commonPage.getUserDropdown().click();
          element(by.cssContainingText('.dropdown-item', 'Profile')).click();
          expect(browser.getTitle()).toContain(UserPage.DATA.name);
          /**
           * Get current URL and expect to contain the user's username in it, like so: "feed/user/USERNAME".
           */
          browser.getCurrentUrl().then((url: string): void => {
            expect(url).toContain(UserPage.DATA.username);
          });
        }
      });
    });
  });

  afterEach(async (): Promise<void> => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
  });
});
