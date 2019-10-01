import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '@app/interfaces/api-response';
import { Pagination } from '@app/interfaces/pagination';
import { Entry } from '@app/interfaces/v1/entry';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
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

  /**
   * Is showing posts or pages
   * @see DashRoutingModule
   */
  readonly isPages: boolean = this.route.snapshot.data.pages === true;

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
   * Load entries (posts or pages)
   *
   * @param page Page number
   */
  getEntries(page: number = 1) {
    this.loading = true;
    this.entryService.getEntries({
      is_page: this.isPages,
    }, page).subscribe((response: ApiResponse<Entry>): void => {
      this.pagination = {
        itemsPerPage: EntryService.PAGE_SIZE,
        totalItems: response.count,
      };
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
}
