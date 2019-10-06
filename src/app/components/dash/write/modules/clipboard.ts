import Quill, { RangeStatic } from 'quill';
import Delta from 'quill-delta';

const ClipboardModule: any = Quill.import('modules/clipboard');

class CustomClipboard extends ClipboardModule {
  onPaste(event: ClipboardEvent): void {
    if (event.defaultPrevented || !this.quill.isEnabled()) {
      return;
    }
    const range: RangeStatic = this.quill.getSelection();
    let delta: Delta = new Delta().retain(range.index);
    this.container.focus();
    setTimeout((): void => {
      this.quill.selection.update('silent');
      delta = delta.concat(this.convert()).delete(range.length);
      this.quill.updateContents(delta, 'user');
      this.quill.setSelection(delta.length() - range.length, range.length, 'silent');
      this.quill.scrollIntoView();
    }, 1);
  }
}

Quill.register('modules/clipboard', CustomClipboard, true);
