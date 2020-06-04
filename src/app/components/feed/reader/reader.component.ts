import { DOCUMENT } from '@angular/common';
import { Component, OnInit, OnDestroy, Renderer2, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationStart } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FeedService } from '@app/components/feed/feed.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { ReaderCache } from '@app/interfaces/reader-cache';
import { Entry } from '@app/interfaces/zero/entry';
import { Subscription, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.scss'],
})
export class ReaderComponent implements OnInit, OnDestroy, AfterViewInit {

  /**
   * Represents a disposable resource, such as the execution of an Observable.
   * A subscription has one important method, `unsubscribe`, that takes no argument
   * and just disposes the resource held by the subscription.
   */
  private readonly subscription: Subscription = new Subscription();

  /**
   * Un-subscriber indicator. It's being used to cancel API calls when leaving the route.
   */
  private readonly unsubscribe: Subject<void> = new Subject<void>();

  /**
   * Keep cached data because we won't have the original cached data after we clear it.
   */
  private readerCache: ReaderCache;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * List of entries
   */
  entries: Entry[];

  /**
   * Entries API response. Used for caching.
   */
  response: ApiResponse<Entry>;

  /**
   * Next page endpoint
   */
  next: string;

  constructor(@Inject(DOCUMENT) private document: Document,
              private route: ActivatedRoute,
              private router: Router,
              private renderer2: Renderer2,
              private feed: FeedService) {
    // When navigation starts and it's heading to a detail on an entry, then set cache data.
    this.subscription.add(
      this.router.events
        .pipe(
          filter((event: RouterEvent): boolean => event instanceof NavigationStart && event.url.includes('feed/entry')),
        )
        .subscribe((): void => {
          FeedService.readerCache = {
            key: this.route.snapshot.data.route,
            response: this.response,
            scrollTopPosition: this.document.getElementsByClassName('feed-scroller')[0].scrollTop,
          };
        }),
    );
  }

  ngOnInit(): void {
    /**
     * Watch search query
     */
    this.subscription.add(AppComponent.SEARCH_QUERY.subscribe((search: string): void => {
      this.getEntries(search);
    }));
    /**
     * If reader has cache and the key of the cache matches the current route name then use that cache
     * to load data and prevent API call. At the end clear the cache.
     *
     * @see ReaderCache.key
     */
    if (FeedService.readerCache && FeedService.readerCache.key === this.route.snapshot.data.route &&
      FeedService.readerCache.response) {
      this.readerCache = FeedService.readerCache;
      this.next = this.readerCache.response.next;
      this.entries = this.readerCache.response.results;
      this.response = this.readerCache.response;
      // Clear cache because we already used it and also to prevent unwanted data from existing.
      FeedService.clearReaderCache();
      return;
    }
    FeedService.clearReaderCache();
    /**
     * Load entries
     */
    this.getEntries();
  }

  /**
   * Load entries
   */
  getEntries(search: string = ''): void {
    this.loading = true;
    this.feed.getEntries({ show: this.route.snapshot.data.showFilter, search })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((data: ApiResponse<Entry>): void => {
        this.next = data.next;
        this.entries = data.results;
        this.loading = false;
        this.response = data;
      });
  }

  ngAfterViewInit(): void {
    /**
     * Set scroll top position to cached position only if cache exists and it has scroll top position.
     */
    if (this.readerCache && this.readerCache.scrollTopPosition) {
      this.document.getElementsByClassName('feed-scroller')[0].scrollTop = this.readerCache.scrollTopPosition;
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe subscription to cancel API calls when leaving the route. This is useful to prevent unwanted API calls
    // from continuing when they are not needed.
    this.unsubscribe.next();
    this.unsubscribe.complete();
    // Disposes the resources held by the subscription. May, for instance, cancel
    // an ongoing Observable execution or cancel any other type of work that
    // started when the Subscription was created.
    this.subscription.unsubscribe();
  }
}
