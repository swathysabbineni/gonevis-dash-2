import { browser, logging } from 'protractor';
import { CommonPage } from '../../common.po';
import { TagsPage } from './tags.po';

describe('Dash Tags', () => {

  let page: TagsPage;
  let commonPage: CommonPage;

  beforeAll(() => {
    commonPage = new CommonPage();
    commonPage.signIn();
  });

  beforeEach(() => {
    page = new TagsPage();
  });

  it('should navigate to it', () => {
    commonPage.waitForSignIn().then(() => {
      page.navigateTo();
      expect(browser.getTitle()).toContain('Tags');
    });
  });

  afterEach(async () => {
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
  });
});
