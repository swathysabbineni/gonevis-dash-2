import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
  }

  getBackgroundImage(i: number): SafeStyle {
    return this.sanitizer.sanitize(SecurityContext.STYLE, `url(https://picsum.photos/548?${i})`);
  }
}
