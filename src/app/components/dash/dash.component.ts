import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { SearchSuggestions } from '@app/consts/search-suggestions';
import { DashUiStatus } from '@app/enums/dash-ui-status';
import { SidebarLink } from '@app/interfaces/sidebar-link';
import { BlogService } from '@app/services/blog/blog.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons/faNewspaper';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons/faAngleDoubleLeft';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faChartLine } from '@fortawesome/free-solid-svg-icons/faChartLine';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment';
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import { faThLarge } from '@fortawesome/free-solid-svg-icons/faThLarge';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit, OnDestroy {

  /**
   * Represents a disposable resource, such as the execution of an Observable.
   * A subscription has one important method, `unsubscribe`, that takes no argument
   * and just disposes the resource held by the subscription.
   */
  private readonly subscription: Subscription = new Subscription();

  /**
   * Angle double left icon
   */
  readonly faAngleDoubleLeft: IconDefinition = faAngleDoubleLeft;

  readonly dashUiStatus = DashUiStatus;

  /**
   * Status of header/sidebar (show or hide)
   */
  uiStatus: DashUiStatus = DashUiStatus.ALL;

  /**
   * Determines whether sidebar is closed or not
   */
  openSidebar: boolean;

  /**
   * Sidebar items
   */
  links: SidebarLink[] = [{
    path: 'main',
    label: 'DASHBOARD',
    icon: faTachometerAlt,
  }, {
    path: 'write',
    label: 'WRITE',
    icon: faPen,
  }, {
    path: 'posts',
    label: 'POSTS',
    icon: faThLarge,
  }, {
    path: 'pages',
    label: 'PAGES',
    icon: faNewspaper,
  }, {
    path: 'comments',
    label: 'COMMENTS',
    icon: faComment,
  }, {
    path: 'tags',
    label: 'TAGS',
    icon: faHashtag,
  }, {
    path: 'media',
    label: 'MEDIA',
    icon: faImage,
  }, {
    path: 'circle',
    label: 'CIRCLES',
    icon: faSpinner,
    new: true,
  }, {
    path: 'statistics',
    label: 'STATISTICS',
    icon: faChartLine,
  }, {
    path: 'navigation',
    label: 'NAVIGATION',
    icon: faBars,
  }, {
    path: 'team',
    label: 'TEAM',
    icon: faUser,
  }, {
    path: 'settings',
    label: 'SETTINGS',
    icon: faCog,
  }, {
    path: 'help',
    label: 'HELP',
    icon: faInfoCircle,
  }];

  constructor(private route: ActivatedRoute,
              private router: Router) {
    /**
     * Get blog index from param (and watch for changes)
     */
    this.route.params.subscribe((params: Params): void => {
      const index: number = +params.blog;
      /**
       * If blog doesn't exist by given index in params, then redirect to first blog.
       */
      if (!BlogService.blogs[index]) {
        this.router.navigate(['dash', 0]);
      }
    });
    if (JSON.parse(localStorage.getItem('sidebar')) === null) {
      this.toggleSidebar();
    } else {
      this.openSidebar = JSON.parse(localStorage.getItem('sidebar'));
    }
  }

  ngOnInit() {
    /**
     * Enable search bar
     */
    AppComponent.SEARCH_STATUS.emit(true);
    /**
     * Watch search query changes and keep suggesting
     */
    this.subscription.add(AppComponent.SEARCH_QUERY_UPDATE.subscribe((search: string): void => {
      const suggestions = [];
      if (search.length) {
        for (const suggestion of SearchSuggestions) {
          if ((suggestion.keywords.join() + suggestion.label).toLowerCase().includes(search.toLowerCase())) {
            suggestions.push(suggestion.label);
          }
        }
      }
      AppComponent.SEARCH_SUGGESTIONS.emit(suggestions);
    }));
    /**
     * Watch search suggestion clicks
     */
    this.subscription.add(AppComponent.SEARCH_SUGGESTION_CLICK.subscribe((suggestion: string): void => {
      AppComponent.SEARCH_QUERY.emit('');
      this.router.navigate([SearchSuggestions.find(item => item.label === suggestion).path], {
        relativeTo: this.route,
      });
    }));
    /**
     * Watch ui status changes
     * @see UI_STATUS
     */
    this.subscription.add(AppComponent.UI_STATUS.subscribe((status: DashUiStatus): void => {
      setTimeout((): void => {
        this.uiStatus = status;
      });
    }));
  }

  ngOnDestroy(): void {
    /**
     * Disable search bar and suggestions
     */
    AppComponent.SEARCH_STATUS.emit(false);
    AppComponent.SEARCH_SUGGESTIONS.emit([]);
    AppComponent.SEARCH_QUERY.emit('');
    this.subscription.unsubscribe();
  }

  /**
   * Toggle sidebar and update local storage value
   */
  toggleSidebar(): void {
    localStorage.setItem('sidebar', String(!this.openSidebar));
    this.openSidebar = !this.openSidebar;
    // Dispatch a resize event on window after 200ms (which's the time it takes until sidebar opens) to fix charts.
    setTimeout((): void => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
  }
}
