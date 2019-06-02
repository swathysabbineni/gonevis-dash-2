import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiResponseCreated } from '@app/interfaces/api-response-created';
import { CommentFeed } from '@app/interfaces/comment-feed';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { EntryService } from '@app/services/entry/entry.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {

  /**
   * Entry ID
   */
  private entryId: string;

  /**
   * Entry
   */
  entry: EntryFeed;

  /**
   * Comments
   */
  comments: CommentFeed[] = [];

  constructor(private sanitizer: DomSanitizer,
              private activatedRoute: ActivatedRoute,
              private entryService: EntryService,
              private feedService: FeedService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.entryId = params.entryId;
      // Get entry
      this.entryService.getEntry(this.entryId).subscribe((data: EntryFeed): void => {
        this.entry = data;
      }, (error: HttpErrorResponseApi): void => {
        if (error.status === 404) {
        }
      });
      // Get comments
      this.entryService.getComments(this.entryId).subscribe((comments: ApiResponse<CommentFeed>): void => {
        this.comments = comments.results;
      });
    });
  }

  /**
   * Toggle entry like for user
   */
  like(): void {
    // Check for loading
    if (this.entry.loading) {
      return;
    }
    this.entry.loading = true;
    // Update like count
    if (this.entry.is_voted) {
      this.entry.vote_count--;
    } else {
      this.entry.vote_count++;
    }
    // Update voted
    this.entry.is_voted = !this.entry.is_voted;
    // API call
    this.feedService.likeEntry(this.entry.id).subscribe((data: ApiResponseCreated): void => {
      this.entry.is_voted = data.created;
      this.entry.loading = false;
    });
  }

  /**
   * Toggle entry bookmark for user
   */
  bookmark(): void {
    // Check for loading
    if (this.entry.loading) {
      return;
    }
    this.entry.loading = true;
    // Update is bookmarked
    this.entry.is_bookmarked = !this.entry.is_bookmarked;
    // API call
    this.feedService.bookmark(this.entry.id).subscribe((data: ApiResponseCreated): void => {
      this.entry.is_bookmarked = data.created;
      this.entry.loading = false;
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
}
