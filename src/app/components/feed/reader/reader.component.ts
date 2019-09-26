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
      let show: 'feed' | 'bookmarked' | '' = '';
      if (data.route === 'updates') {
        show = 'feed';
      } else if (data.route === 'bookmarks') {
        show = 'bookmarked';
      }
      this.feedService.getEntries(null, null, show).subscribe(onLoadEntries);
    });
  }
}
