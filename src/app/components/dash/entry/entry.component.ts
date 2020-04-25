import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntryStatus } from '@app/enums/entry-status.enum';
import { Order } from '@app/enums/order';
import { ApiResponse } from '@app/interfaces/api-response';
import { Filter } from '@app/interfaces/filter';
import { Pagination } from '@app/interfaces/pagination';
import { Sort } from '@app/interfaces/sort';
import { Entry } from '@app/interfaces/v1/entry';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCalendar } from '@fortawesome/free-regular-svg-icons/faCalendar';
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons/faThumbsUp';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faSort } from '@fortawesome/free-solid-svg-icons/faSort';
import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons/faSortAmountDown';
import { faSortAmountUp } from '@fortawesome/free-solid-svg-icons/faSortAmountUp';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { EntryService } from './entry.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {

  readonly filter: IconDefinition = faFilter;
  readonly sort: IconDefinition = faSort;
  readonly comment: IconDefinition = faComment;
  readonly like: IconDefinition = faThumbsUp;
  readonly eye: IconDefinition = faEye;
  readonly ellipsis: IconDefinition = faEllipsisV;
  readonly times: IconDefinition = faTimes;
  readonly ascending: IconDefinition = faSortAmountUp;
  readonly descending: IconDefinition = faSortAmountDown;
  readonly create: IconDefinition = faPlus;

  /**
   * Exposed for view
   */
  readonly entryStatus = EntryStatus;
  readonly order = Order;

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
  }, {
    value: EntryStatus.Private,
    label: 'Private',
  }, {
    value: EntryStatus.Trash,
    label: 'Trash',
  }];

  /**
   * List of sorting fields
   */
  readonly sortFields: Sort[] = [{
    value: 'vote_count',
    label: 'LIKES',
    icon: this.like,
  }, {
    value: 'comment_count',
    label: 'COMMENTS',
    icon: this.comment,
  }, {
    value: 'view_count',
    label: 'VIEWS',
    icon: this.eye,
  }, {
    value: 'published',
    label: 'PUBLISH_DATE',
    icon: faCalendar,
  }, {
    value: 'created',
    label: 'CREATE_DATE',
    icon: faCalendar,
  }, {
    value: 'updated',
    label: 'UPDATE_DATE',
    icon: faCalendar,
  }];

  /**
   * List of entries (pages or posts)
   */
  entries: Entry[];

  /**
   * API pagination data
   */
  pagination: Pagination = {
    itemsPerPage: EntryService.PAGE_SIZE,
    totalItems: 0,
    currentPage: 1,
    id: 'pagination',
  };

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * Current search text
   */
  search: string;

  /**
   * Current status filter
   */
  statusFilter: Filter<EntryStatus> = this.statusFilters[1];

  /**
   * Current sort field
   */
  sortField: Sort;

  /**
   * Sorting order (ascending or descending)
   */
  sortOrder: Order = Order.ASCENDING;

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
    /**
     * Load entries
     */
    this.getEntries();
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
   * @param resetPagination Reset pagination
   */
  getEntries(page: number = 1, resetPagination?: boolean): void {
    this.pagination.currentPage = page;
    this.loading = true;
    let ordering = '';
    if (this.sortField) {
      ordering = this.sortField.value;
    }
    if (this.sortOrder === Order.DESCENDING) {
      ordering = `-${ordering}`;
    }
    this.entryService.getEntries({
      is_page: this.isPages,
      status: this.statusFilter.value,
      search: this.search || '',
      ordering,
    }, page).subscribe((response: ApiResponse<Entry>): void => {
      this.pagination.totalItems = response.count;
      this.entries = response.results;
      this.loading = false;
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
   * Add entry to navigation
   *
   * @param title Entry title
   * @param slug Entry slug
   */
  addToNavs(title: string, slug: string): void {
    this.router.navigate(['navigation'], {
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
        entry[property as string] = data[property];
        this.toast.info(this.translate.instant('TOAST_UPDATE'), entry.title);
      }), (error: HttpErrorResponse): void => {
        console.error('Failed to update selected entry', entry.id, property, value, error.error);
      });
    }
  }

  /**
   * Toggle sort order
   */
  toggleOrder(): void {
    if (this.sortOrder === Order.ASCENDING) {
      this.sortOrder = Order.DESCENDING;
    } else {
      this.sortOrder = Order.ASCENDING;
    }
    this.getEntries();
  }
}
