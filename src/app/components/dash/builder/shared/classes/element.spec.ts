import { Element } from './element';

fdescribe('Element', () => {

  it('should create an instance', () => {
    expect(new Element()).toBeTruthy();
  });

  it('should render elements', () => {
    expect(Element.render([
      new Element({ tag: 'span' }),
      new Element({ tag: 'div' }),
    ])).toEqual('<span></span><div></div>');
  });

  it('should render tag', () => {
    const element = new Element({ tag: 'span' });
    expect(element.render()).toEqual('<span></span>');
    element.tag = 'div';
    expect(element.render()).toEqual('<div></div>');
  });

  it('should render text', () => {
    const element = new Element({ tag: 'span', text: 'hello world' });
    expect(element.render()).toEqual('<span>hello world</span>');
  });

  it('should render attributes', () => {
    const span = new Element({
      tag: 'span',
      attributes: {
        id: 'foo',
        title: 'bar',
      },
    });
    expect(span.render()).toEqual('<span id="foo" title="bar"></span>');
    span.attributes = {
      class: ['foo', 'bar'],
    };
    expect(span.render()).toEqual('<span class="foo bar"></span>');
  });

  it('should render children', () => {
    const element = new Element({
      tag: 'div',
      children: [
        new Element({ tag: 'button' }),
        new Element({ tag: 'span' }),
      ],
    });
    expect(element.render()).toEqual('<div><button></button><span></span></div>');
  });
});
