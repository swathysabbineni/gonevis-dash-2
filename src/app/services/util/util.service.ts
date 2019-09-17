import { Injectable } from '@angular/core';
import { DomSanitizer, SafeStyle, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

  constructor(private domSanitizer: DomSanitizer) {
  }

  /**
   * Bypass security and trust the given value to be safe style value (CSS).
   *
   * @param url Image URL
   */
  sanitizeBackgroundImage(url: string): SafeStyle {
    return this.domSanitizer.bypassSecurityTrustStyle(`url(${url})`);
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
