import { Component, OnInit } from '@angular/core';
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

  entries: Entry[];

  constructor(private entryService: EntryService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    /**
     * Load entries
     */
    this.entryService.getEntries().subscribe((response: ApiResponse<Entry>): void => {
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
}
