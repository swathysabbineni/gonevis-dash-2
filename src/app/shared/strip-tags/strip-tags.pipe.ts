import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stripTags' })
export class StripTagsPipe implements PipeTransform {

  /**
   * Strip HTML tags from given HTML string.
   *
   * @param value HTML string.
   */
  transform(value: string): string {
    return value.replace(/<(?:.|\s)*?>/g, '');
  }
}
