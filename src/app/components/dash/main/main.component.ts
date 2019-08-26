import { Component, OnInit } from '@angular/core';
import { CommentsService } from '@app/components/dash/comments/comments.service';
import { EntryService } from '@app/components/dash/entry/entry.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { Comment } from '@app/interfaces/v1/comment';
import { Entry } from '@app/interfaces/v1/entry';
import { Metrics } from '@app/interfaces/v1/metrics';
import { TemplateConfig } from '@app/interfaces/v1/template-config';
import { BlogService } from '@app/services/blog/blog.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

  /**
   * List of recent blog comments
   */
  comments: Comment[];

  /**
   * List of recent blog entries
   */
  entries: Entry[];

  /**
   * Metrics (data count, etc)
   */
  metrics: Metrics;

  /**
   * Template config data
   */
  templateConfig: TemplateConfig;

  constructor(private blogService: BlogService,
              private entryService: EntryService,
              private commentsService: CommentsService) {
  }

  ngOnInit(): void {
    /**
     * Load entries
     */
    this.entryService.getEntries().subscribe((response: ApiResponse<Entry>): void => {
      this.entries = response.results;
    });
    /**
     * Load comments
     */
    this.commentsService.getComments().subscribe((response: ApiResponse<Comment>): void => {
      this.comments = response.results;
    });
    /**
     * Load metrics
     */
    this.blogService.getMetrics().subscribe((data: Metrics): void => {
      this.metrics = data;
    });
    /**
     * Load template config
     */
    this.blogService.getTemplateConfig().subscribe((data: { template_config: TemplateConfig }): void => {
      this.templateConfig = data.template_config;
    });
  }
}
