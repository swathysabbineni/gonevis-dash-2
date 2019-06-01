import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { ApiService } from '@app/services/api/api.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent implements OnInit {

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * List of entries
   */
  @Input() entries: EntryFeed[];

  /**
   * Next page endpoint
   */
  @Input() next: string;

  constructor(private sanitizer: DomSanitizer,
              private activatedRoute: ActivatedRoute,
              private feedService: FeedService,
              private apiService: ApiService) {
  }

  ngOnInit() {
  }

  /**
   * Toggle entry like for user
   *
   * @param entry Entry to like
   */
  like(entry: EntryFeed): void {
    // Check for loading
    if (entry.loading) {
      return;
    }
    entry.loading = true;
    // Update like count
    if (entry.is_voted) {
      entry.vote_count--;
    } else {
      entry.vote_count++;
    }
    // Update voted
    entry.is_voted = !entry.is_voted;
    // API call
    this.feedService.likeEntry(entry.id).subscribe((data: ApiResponseCreated): void => {
      entry.is_voted = data.created;
      entry.loading = false;
    });
  }

  /**
   * Toggle entry bookmark for user
   *
   * @param entry Entry to bookmark
   */
  bookmark(entry: EntryFeed): void {
    // Check for loading
    if (entry.loading) {
      return;
    }
    entry.loading = true;
    // Update is bookmarked
    entry.is_bookmarked = !entry.is_bookmarked;
    // API call
    this.feedService.bookmark(entry.id).subscribe((data: ApiResponseCreated): void => {
      entry.is_bookmarked = data.created;
      entry.loading = false;
    });
  }

  /**
   * Bypass security and trust the given value to be safe style value (CSS).
   *
   * @param url Entry cover image URL
   */
  getBackgroundImage(url: string): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
  }

  /**
   * Load more
   *
   * @param endpoint Next page endpoint
   */
  loadMore(endpoint: string): void {
    if (!this.next || this.loading) {
      return;
    }
    this.loading = true;
    this.apiService.getEndpoint<EntryFeed>(endpoint).subscribe((data: ApiResponse<EntryFeed>): void => {
      this.next = data.next;
      this.loading = false;
      data.results.map((entry: EntryFeed): void => {
        this.entries.push(entry);
      });
    });
  }
}
