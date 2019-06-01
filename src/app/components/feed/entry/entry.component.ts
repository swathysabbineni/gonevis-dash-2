import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { EntryService } from '@app/services/entry/entry.service';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {

  /**
   * Entry ID
   */
  private entryId: string;

  constructor(private activatedRoute: ActivatedRoute,
              private entryService: EntryService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.entryId = params.entryId;
      this.getEntry();
    });
  }

  getEntry(): void {
    this.entryService.getEntry(this.entryId).subscribe((data: EntryFeed): void => {
      console.log(data);
    }, (error: HttpErrorResponseApi): void => {
      if (error.status === 404) {
      }
    });
  }
}
