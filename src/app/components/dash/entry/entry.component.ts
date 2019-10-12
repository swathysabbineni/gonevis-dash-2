import { HttpErrorResponse } from '@angular/common/http';
import { isSyntheticPropertyOrListener } from '@angular/compiler/src/render3/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryStatus } from '@app/enums/entry-status.enum';
import { ApiResponse } from '@app/interfaces/api-response';
import { Filter } from '@app/interfaces/filter';
import { Pagination } from '@app/interfaces/pagination';
import { Entry } from '@app/interfaces/v1/entry';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { TranslateService } from '@ngx-translate/core';
import { PageChangedEvent } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EntryService } from './entry.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {

  readonly filter: IconDefinition = faFilter;

  /**
   * Exposed for view
   */
  readonly entryStatus = EntryStatus;

  /**
   * Is showing posts or pages
   * @see DashRoutingModule
   */
  readonly isPages: boolean = this.route.snapshot.data.pages === true;

  /**
   * List of status filters
   */
  readonly statusFilters: Filter<EntryStatus>[] = [{
    value: '',
    label: 'ANY_STATUS',
  }, {
    value: EntryStatus.Published,
    label: 'PUBLISHED',
  }, {
    value: EntryStatus.Draft,
    label: 'DRAFT',
  }];

  /**
   * List of entries (pages or posts)
   */
  entries: Entry[];

  /**
   * API pagination data
   */
  pagination: Pagination;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * Current status filter
   */
  statusFilter: Filter<EntryStatus> = this.statusFilters[1];

  /**
   * Main select checkbox (used to select and deselect all)
   */
  select: boolean;

  /**
   * @returns Selected entries
   */
  get entriesSelected(): Entry[] {
    return this.entries.filter(entry => entry.select);
  }

  /**
   * @returns Whether select is indeterminate or not
   */
  get isSelectIndeterminate(): boolean {
    return Boolean(this.entries.length > this.entriesSelected.length && this.entriesSelected.length > 0);
  }

  constructor(private entryService: EntryService,
              private translate: TranslateService,
              private route: ActivatedRoute,
              private router: Router,
              private toast: ToastrService) {
  }

  ngOnInit(): void {
    BlogService.blog.subscribe((blog: BlogMin): void => {
      if (blog) {
        /**
         * Load entries
         */
        this.getEntries();
      }
    });
  }

  /**
   * On main select checked or unchecked
   */
  onToggleSelect(): void {
    for (const entry of this.entries) {
      entry.select = this.select;
    }
  }

  /**
   * On entry selection changed
   */
  onEntrySelect(): void {
    this.select = this.entriesSelected.length === this.entries.length;
  }

  /**
   * Load entries (posts or pages)
   *
   * @param page Page number
   */
  getEntries(page: number = 1): void {
    this.loading = true;
    this.entryService.getEntries({
      is_page: this.isPages,
      status: this.statusFilter.value,
    }, page).subscribe((response: ApiResponse<Entry>): void => {
      this.pagination = {
        itemsPerPage: EntryService.PAGE_SIZE,
        totalItems: response.count,
      };
      this.entries = response.results;
      this.loading = false;
      this.entries[0].created = new Date(this.entries[0].created).toUTCString();
    });
  }

  /**
   * Delete a entry
   *
   * @param entry Entry to delete
   */
  delete(entry: Entry): void {
    if (!confirm(this.translate.instant('CONFORM_DELETE_ENTRY'))) {
      return;
    }
    entry.loading = true;
    this.entryService.delete(entry.id).subscribe((): void => {
      this.toast.info(this.translate.instant('TOAST_DELETE'), entry.title);
      this.entries.splice(this.entries.indexOf(entry), 1);
    });
  }

  /**
   * Add entry to navigations
   *
   * @param title Entry title
   * @param slug Entry slug
   */
  addToNavigation(title: string, slug: string): void {
    this.router.navigate(['navs'], {
      relativeTo: this.route.parent.parent,
      state: {
        add: {
          label: title,
          url: `/${slug}`,
        },
      },
    });
  }

  /**
   * Pagination event
   */
  pageChanged(event: PageChangedEvent) {
    this.getEntries(event.page);
  }

  /**
   * Bulk action to update selected entries
   *
   * @param property Updating property name
   * @param value Updating property value
   */
  updateEntries(property: keyof Entry, value: any): void {
    for (const entry of this.entriesSelected) {
      const PAYLOAD: { [property: string]: any } = {};
      PAYLOAD[property] = value;
      this.entryService.update(entry.id, PAYLOAD).subscribe(((data: Entry): void => {
        entry[property] = data[property];
        this.toast.info(this.translate.instant('TOAST_UPDATE'), entry.title);
      }), (error: HttpErrorResponse): void => {
        console.error('Failed to update selected entry', entry.id, property, value, error.error);
      });
    }
  }
}
