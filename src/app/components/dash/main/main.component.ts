import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommentsService } from '@app/components/dash/comments/comments.service';
import { EntryService } from '@app/components/dash/entry/entry.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { Comment } from '@app/interfaces/v1/comment';
import { Entry } from '@app/interfaces/v1/entry';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  /**
   * Is showing posts or pages
   * @see DashRoutingModule
   */
  readonly isPages: boolean = this.route.snapshot.data.pages === true;

  /**
   * List of comments
   */
  comments: Comment[];

  /**
   * Comments count
   */
  commentsCount = 0;

  /**
   * List of entries
   */
  entries: Entry[];

  /**
   * Entries count
   */
  entriesCount = 0;

  constructor(private commentsService: CommentsService,
              private entryService: EntryService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    /**
     * Get comments
     */
    this.commentsService.getComments().subscribe((response: ApiResponse<Comment>): void => {
      this.comments = response.results;
      this.commentsCount = response.count;
    });
    /**
     * Load entries
     */
    this.entryService.getEntries({
      is_page: this.isPages,
    }).subscribe((response: ApiResponse<Entry>): void => {
      this.entries = response.results;
      this.entriesCount = response.count;
    });
  }
}
