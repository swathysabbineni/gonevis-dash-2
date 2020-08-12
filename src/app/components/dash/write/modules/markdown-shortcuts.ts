import Quill, { RangeStatic, DeltaStatic, Sources } from 'quill';

class MarkdownShortcuts {
  quill: Quill;
  ignoreTags: string[];
  matches: any;

  constructor(quill: Quill) {
    this.quill = quill;
    this.ignoreTags = ['PRE'];
    this.matches = [
      {
        name: 'header',
        pattern: /^(#){1,6}\s/g,
        action: (text: string, selection: RangeStatic, pattern: RegExp) => {
          const match: RegExpExecArray | null = pattern.exec(text);
          if (!match) {
            return;
          }
          const size: number = match[0].length;
          // Need to defer this action https://github.com/quilljs/quill/issues/1134
          setTimeout((): void => {
            this.quill.formatLine(selection.index, 0, 'header', size - 1);
            this.quill.deleteText(selection.index - size, size);
          }, 0);
        },
      },
      {
        name: 'blockquote',
        pattern: /^(>)\s/g,
        action: (text: string, selection: RangeStatic): void => {
          // Need to defer this action https://github.com/quilljs/quill/issues/1134
          setTimeout((): void => {
            this.quill.formatLine(selection.index, 1, 'blockquote', true);
            this.quill.deleteText(selection.index - 2, 2);
          }, 0);
        },
      },
      {
        name: 'code-block',
        pattern: /^`{3}(?:\s|\n)/g,
        action: (text: string, selection: RangeStatic): void => {
          // Need to defer this action https://github.com/quilljs/quill/issues/1134
          setTimeout((): void => {
            this.quill.formatLine(selection.index, 1, 'code-block', true);
            this.quill.deleteText(selection.index - 4, 4);
          }, 0);
        },
      },
      {
        name: 'bolditalic',
        pattern: /(?:\*|_){3}(.+?)(?:\*|_){3}/g,
        action: (text: string, selection: RangeStatic, pattern: RegExp, lineStart) => {
          const match = pattern.exec(text);

          const annotatedText = match[0];
          const matchedText = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) {
            return;
          }

          setTimeout(() => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { bold: true, italic: true });
            this.quill.format('bold', false);
          }, 0);
        },
      },
      {
        name: 'bold',
        pattern: /(?:\*|_){2}(.+?)(?:\*|_){2}/g,
        action: (text: string, selection: RangeStatic, pattern: RegExp, lineStart: number): void => {
          const match: RegExpExecArray | null = pattern.exec(text);

          const annotatedText: string = match[0];
          const matchedText: string = match[1];
          const startIndex: number = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) {
            return;
          }

          setTimeout((): void => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { bold: true });
            this.quill.format('bold', false);
          }, 0);
        },
      },
      {
        name: 'italic',
        pattern: /(?:\*|_){1}(.+?)(?:\*|_){1}/g,
        action: (text: string, selection: RangeStatic, pattern: RegExp, lineStart: number): void => {
          const match: RegExpExecArray | null = pattern.exec(text);

          const annotatedText: string = match[0];
          const matchedText: string = match[1];
          const startIndex: number = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) {
            return;
          }

          setTimeout((): void => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { italic: true });
            this.quill.format('italic', false);
          }, 0);
        },
      },
      {
        name: 'strikethrough',
        pattern: /(?:~~)(.+?)(?:~~)/g,
        action: (text: string, selection: RangeStatic, pattern: RegExp, lineStart: number): void => {
          const match: RegExpExecArray | null = pattern.exec(text);

          const annotatedText: string = match[0];
          const matchedText: string = match[1];
          const startIndex: number = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) {
            return;
          }

          setTimeout((): void => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { strike: true });
            this.quill.format('strike', false);
          }, 0);
        },
      },
      {
        name: 'code',
        pattern: /(?:`)(.+?)(?:`)/g,
        action: (text: string, selection: RangeStatic, pattern: RegExp, lineStart: number): void => {
          const match: RegExpExecArray | null = pattern.exec(text);

          const annotatedText: string = match[0];
          const matchedText: string = match[1];
          const startIndex = lineStart + match.index;

          if (text.match(/^([*_ \n]+)$/g)) {
            return;
          }

          setTimeout((): void => {
            this.quill.deleteText(startIndex, annotatedText.length);
            this.quill.insertText(startIndex, matchedText, { code: true });
            this.quill.format('code', false);
          }, 0);
        },
      },
      {
        name: 'hr',
        pattern: /^([-*]\s?){3}/g,
        action: (text: string, selection: RangeStatic): void => {
          const startIndex: number = selection.index - text.length;
          setTimeout((): void => {
            this.quill.deleteText(startIndex, text.length);
            this.quill.insertEmbed(startIndex + 1, 'divider', true, (Quill as any).sources.USER);
            this.quill.insertText(startIndex + 2, '\n', (Quill as any).sources.SILENT);
            this.quill.setSelection(startIndex + 2, (Quill as any).sources.SILENT);
          }, 0);
        },
      },
      {
        name: 'plus-ul',
        // Quill 1.3.5 already treat * as another trigger for bullet lists
        pattern: /^\+\s$/g,
        action: (text: string, selection: RangeStatic, pattern: RegExp): void => {
          setTimeout((): void => {
            this.quill.formatLine(selection.index, 1, 'list', 'unordered');
            this.quill.deleteText(selection.index - 2, 2);
          }, 0);
        },
      },
      // {
      //   name: 'image',
      //   pattern: /(?:!\[(.+?)\])(?:\((.+?)\))/g,
      //   action: (text: string, selection: RangeStatic, pattern: RegExp): void => {
      //     const startIndex: number = text.search(pattern);
      //     const matchedText: string = text.match(pattern)[0];
      //     const hrefLink: string = text.match(/(?:\((.*?)\))/g)[0];
      //     const start: number = selection.index - matchedText.length - 1;
      //     if (startIndex !== -1) {
      //       setTimeout((): void => {
      //         this.quill.deleteText(start, matchedText.length);
      //         this.quill.insertEmbed(start, 'image', hrefLink.slice(1, hrefLink.length - 1));
      //       }, 0);
      //     }
      //   },
      // },
      {
        name: 'link',
        pattern: /(?:\[(.+?)\])(?:\((.+?)\))/g,
        action: (text: string, selection: RangeStatic, pattern: RegExp): void => {
          const startIndex: number = text.search(pattern);
          const matchedText: string = text.match(pattern)[0];
          const hrefText: string = text.match(/(?:\[(.*?)\])/g)[0];
          const hrefLink: string = text.match(/(?:\((.*?)\))/g)[0];
          const start = selection.index - matchedText.length - 1;
          if (startIndex !== -1) {
            setTimeout(() => {
              this.quill.deleteText(start, matchedText.length);
              this.quill.insertText(
                start,
                hrefText.slice(1, hrefText.length - 1),
                'link',
                {
                  href: hrefLink.slice(1, hrefLink.length - 1),
                  target: '_self',
                },
              );
            }, 0);
          }
        },
      },
    ];

    // Handler that looks for insert deltas that match specific characters
    this.quill.on('text-change', (delta: DeltaStatic, oldContents: DeltaStatic, source: Sources): void => {
      for (const deltaOperation of delta.ops) {
        if (deltaOperation.hasOwnProperty('insert')) {
          if (deltaOperation.insert === ' ') {
            this.onSpace();
          } else if (deltaOperation.insert === '\n') {
            this.onEnter();
          }
        }
      }
    });
  }

  isValid(text: string, tagName: string): boolean {
    return (
      typeof text !== 'undefined' &&
      text &&
      this.ignoreTags.indexOf(tagName) === -1
    );
  }

  onSpace(): void {
    const selection: RangeStatic = this.quill.getSelection();
    if (!selection) {
      return;
    }
    const [line, offset]: [any, number] = this.quill.getLine(selection.index);
    const text: string = line.domNode.textContent;
    const lineStart: number = selection.index - offset;
    if (this.isValid(text, line.domNode.tagName)) {
      for (const match of this.matches) {
        const matchedText: RegExpMatchArray | null = text.match(match.pattern);
        if (matchedText) {
          // We need to replace only matched text not the whole line
          match.action(text, selection, match.pattern, lineStart);
          return;
        }
      }
    }
  }

  onEnter(): void {
    const selection: RangeStatic = this.quill.getSelection();
    if (!selection) {
      return;
    }
    const [line, offset]: [any, number] = this.quill.getLine(selection.index);
    const text: string = line.domNode.textContent + ' ';
    const lineStart: number = selection.index - offset;
    selection.length = selection.index++;
    if (this.isValid(text, line.domNode.tagName)) {
      for (const match of this.matches) {
        const matchedText: RegExpMatchArray | null = text.match(match.pattern);
        if (matchedText) {
          match.action(text, selection, match.pattern, lineStart);
          return;
        }
      }
    }
  }
}

Quill.register('modules/markdownShortcuts', MarkdownShortcuts);
