import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from '@app/interfaces/api-response';
import { Entry } from '@app/interfaces/v1/entry';
import { TranslateService } from '@ngx-translate/core';
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

  constructor(private entryService: EntryService,
              private translate: TranslateService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    /**
     * Load entries
     */
    this.entryService.getEntries({
      is_page: this.isPages,
    }).subscribe((response: ApiResponse<Entry>): void => {
      this.entries = response.results;
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
      this.entries.splice(this.entries.indexOf(entry), 1);
    });
  }

  /**
   * Add entry to navigations
   *
   * @param title Entry title
   * @param slug Entry slug
   */
  addToNavigataion(title: string, slug: string): void {
    this.router.navigate(['navs'], {
      relativeTo: this.route.parent.parent,
      state: {
        add: {
          label: title,
          url: `/${ slug }`,
        },
      },
    });
  }
}
