import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { EntryFeed } from '@app/interfaces/entry-feed';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
})
export class ReaderComponent implements OnInit {

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * List of entries
   */
  entries: EntryFeed[];

  /**
   * Next page endpoint
   */
  next: string;

  constructor(private activatedRoute: ActivatedRoute,
              private feedService: FeedService) {
  }

  ngOnInit(): void {
    // Set selected nav
    this.activatedRoute.data.subscribe((data: Data): void => {
      let call = 'getExploreEntries';
      this.loading = true;
      if (data.route === 'updates') {
        call = 'getSubscribedEntries';
      } else if (data.route === 'bookmarks') {
        call = 'getBookmarkedEntries';
      }
      this.feedService[call]().subscribe((entries: ApiResponse<EntryFeed>): void => {
        this.next = entries.next;
        this.entries = entries.results;
        this.loading = false;
      });
    });
  }
}
