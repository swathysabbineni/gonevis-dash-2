import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { ApiService } from '@app/services/api/api.service';
import { EntryService } from '@app/services/entry/entry.service';
import { UtilService } from '@app/services/util/util.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent {

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

  constructor(private activatedRoute: ActivatedRoute,
              private entryService: EntryService,
              private apiService: ApiService,
              public utilService: UtilService) {
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
    this.entryService.like(entry.id).subscribe((data: ApiResponseCreated): void => {
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
    this.entryService.bookmark(entry.id).subscribe((data: ApiResponseCreated): void => {
      entry.is_bookmarked = data.created;
      entry.loading = false;
    });
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
