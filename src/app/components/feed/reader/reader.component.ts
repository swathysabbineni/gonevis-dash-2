import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { Entry } from '@app/interfaces/zero/entry';

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
  entries: Entry[];

  /**
   * Next page endpoint
   */
  next: string;

  constructor(private activatedRoute: ActivatedRoute,
              private feedService: FeedService) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data: Data): void => {
      const onLoadEntries = (entries: ApiResponse<Entry>): void => {
        this.next = entries.next;
        this.entries = entries.results;
        this.loading = false;
      };
      this.loading = true;
      if (data.route === 'updates') {
        this.feedService.getSubscribedEntries().subscribe(onLoadEntries);
      } else if (data.route === 'bookmarks') {
        this.feedService.getBookmarkedEntries().subscribe(onLoadEntries);
      } else {
        this.feedService.getEntries().subscribe(onLoadEntries);
      }
    });
  }
}
