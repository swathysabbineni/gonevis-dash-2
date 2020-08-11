import { StripTagsPipe } from './strip-tags.pipe';

describe('StripTagsPipe', (): void => {
  let pipe: StripTagsPipe;

  beforeEach((): void => {
    pipe = new StripTagsPipe();
  });

  it('Should strip tags', (): void => {
    expect(pipe.transform('<a href="">example</a>')).toEqual('example');
    expect(pipe.transform('<p class="foo">another example</p>')).toEqual('another example');
    expect(pipe.transform('<div><p>Nice</p> <p>Work</p></div>')).toEqual('Nice Work');
  });
});
