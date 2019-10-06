import { Injectable } from '@angular/core';
import { DomSanitizer, SafeStyle, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

  constructor(private domSanitizer: DomSanitizer) {
  }

  /**
   * @returns Offset number by getting page size and current page
   *
   * @param pageSize Maximum items per page
   * @param page Current page number
   */
  static getPageOffset(pageSize: number, page: number): string {
    return `${pageSize * (page - 1)}`;
  }

  /**
   * Bypass security and trust the given value to be safe style value (CSS).
   *
   * @param url Image URL
   * @returns Trusted style URL or nothing of not provided
   */
  sanitizeBackgroundImage(url: string): SafeStyle | null {
    if (url) {
      return this.domSanitizer.bypassSecurityTrustStyle(`url(${url})`);
    }
    return null;
  }

  /**
   * Bypass security and trust the given value to be safe HTML.
   *
   * @param html HTML
   */
  sanitizeHtml(html: string): SafeHtml {
    return this.domSanitizer.bypassSecurityTrustHtml(html);
  }
}
