import Quill, { BoundsStatic, RangeStatic } from 'quill';
import Delta from 'quill-delta';

const ClipboardModule: any = Quill.import('modules/clipboard');

class CustomClipboard extends ClipboardModule {
  onPaste(e: ClipboardEvent): void {
    if (e.defaultPrevented || !this.quill.isEnabled()) {
      return;
    }
    const range: RangeStatic = this.quill.getSelection();
    let delta: Delta = new Delta().retain(range.index);
    this.container.style.top = (window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop || 0).toString() + 'px';
    this.container.focus();
    setTimeout((): void => {
      this.quill.selection.update('silent');
      delta = delta.concat(this.convert()).delete(range.length);
      this.quill.updateContents(delta, 'user');
      this.quill.setSelection(delta.length() - range.length, range.length, 'silent');
      const bounds: BoundsStatic = this.quill.getBounds(delta.length() - range.length, range.length);
      this.quill.scrollingContainer.scrollTop = bounds.top;
    }, 1);
  }
}

Quill.register('modules/clipboard', CustomClipboard, true);
