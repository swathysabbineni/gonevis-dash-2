import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { Entry } from '@app/interfaces/zero/entry';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
})
export class ReaderComponent implements OnInit, OnDestroy {

  /**
   * Represents a disposable resource, such as the execution of an Observable.
   * A subscription has one important method, `unsubscribe`, that takes no argument
   * and just disposes the resource held by the subscription.
   */
  private readonly subscription: Subscription = new Subscription();

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

  constructor(private route: ActivatedRoute,
              private feed: FeedService) {
  }

  ngOnInit(): void {
    /**
     * Watch search query
     */
    this.subscription.add(AppComponent.SEARCH_QUERY.subscribe((search: string): void => {
      this.getEntries(search);
    }));
    /**
     * Load entries
     */
    this.getEntries();
  }

  /**
   * Load entries
   */
  getEntries(search: string = ''): void {
    this.route.data.subscribe((data: Data): void => {
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
      this.feed.getEntries({ show, search }).subscribe(onLoadEntries);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
