import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { Entry } from '@app/interfaces/zero/entry';
import { ApiService } from '@app/services/api/api.service';
import { EntryService } from '@app/services/entry/entry.service';
import { UtilService } from '@app/services/util/util.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faBookmark } from '@fortawesome/free-regular-svg-icons/faBookmark';
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';
import { faShareSquare } from '@fortawesome/free-regular-svg-icons/faShareSquare';
import { faHeart as faHeartFill } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as faBookmarkFill } from '@fortawesome/free-solid-svg-icons/faBookmark';
import { faStar } from '@fortawesome/free-solid-svg-icons/faStar';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent {

  readonly faBookmark: IconDefinition = faBookmark;
  readonly comment: IconDefinition = faComment;
  readonly eye: IconDefinition = faEye;
  readonly heart: IconDefinition = faHeart;
  readonly shareSquare: IconDefinition = faShareSquare;
  readonly heartFill: IconDefinition = faHeartFill;
  readonly bookmarkFill: IconDefinition = faBookmarkFill;
  readonly star: IconDefinition = faStar;

  /**
   * Current entry list
   */
  private currentEntries: Entry[] = [];

  /**
   * Use content instead of excerpt
   */
  @Input() useContent = false;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * Update entry list
   *
   * @param entries Entry list
   */
  @Input() set entries(entries: Entry[]) {
    if (!entries) {
      return;
    }
    /**
     * Sanitize entry content
     */
    entries.forEach((entry: Entry): void => {
      if (this.useContent) {
        entry.content = this.utilService.sanitizeHtml(entry.content) as string;
      }
    });
    this.currentEntries = entries;
  }

  /**
   * Get entry list
   */
  get entries(): Entry[] {
    return this.currentEntries;
  }

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
  like(entry: Entry): void {
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
  bookmark(entry: Entry): void {
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
    this.apiService.getEndpoint<Entry>(endpoint).subscribe((data: ApiResponse<Entry>): void => {
      this.next = data.next;
      this.loading = false;
      data.results.map((entry: Entry): void => {
        this.entries.push(entry);
      });
    });
  }
}
