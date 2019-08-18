import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Entry } from '@app/interfaces/v1/entry';
import { EntryService } from './entry.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {

  entries: Entry[];

  constructor(private entryService: EntryService) {
  }

  ngOnInit(): void {
    /**
     * Load entries
     */
    this.entryService.getEntries().subscribe((response: ApiResponse<Entry>): void => {
      this.entries = response.results;
    });
  }
}
