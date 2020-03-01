import { browser, logging } from 'protractor';
import { ProfilePage } from './profile.po';

describe('User Settings Profile', () => {

  let page: ProfilePage;

  beforeEach(() => {
    page = new ProfilePage();
  });

  it('should navigate to it', () => {
    page.navigateTo();
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
  });
});
