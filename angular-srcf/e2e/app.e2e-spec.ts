import { AngularSrcfPage } from './app.po';

describe('angular-srcf App', function() {
  let page: AngularSrcfPage;

  beforeEach(() => {
    page = new AngularSrcfPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
