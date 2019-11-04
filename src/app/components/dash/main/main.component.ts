import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommentsService } from '@app/components/dash/comments/comments.service';
import { EntryService } from '@app/components/dash/entry/entry.service';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiResponse } from '@app/interfaces/api-response';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { Comment } from '@app/interfaces/v1/comment';
import { Entry } from '@app/interfaces/v1/entry';
import { Metrics } from '@app/interfaces/v1/metrics';
import { TemplateConfig } from '@app/interfaces/v1/template-config';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { UsersModalComponent } from '@app/shared/users-modal/users-modal.component';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faThLarge } from '@fortawesome/free-solid-svg-icons/faThLarge';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {

  private static readonly POSTS_LIMIT = 6;
  private static readonly COMMENTS_LIMIT = 8;

  readonly faPublications: IconDefinition = faThLarge;
  readonly faComments: IconDefinition = faComments;
  readonly faFollowers: IconDefinition = faUserPlus;
  readonly faFiles: IconDefinition = faDatabase;

  /**
   * Blog settings data
   */
  blog: BlogSettings;

  /**
   * List of recent blog comments
   */
  comments: Comment[];

  /**
   * List of recent blog entries
   */
  entries: Entry[];

  /**
   * Subscriber modal to show subscribers
   */
  subscriberModal: BsModalRef;

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
              private commentsService: CommentsService,
              private modalService: BsModalService) {
  }

  /**
   * @returns Cover image or logo (CSS) of current blog
   */
  get blogCover(): string {
    if (this.blog) {
      if (this.blog.media.cover_image) {
        return `url(${this.blog.media.cover_image.file})`;
      }
      if (this.blog.media.logo) {
        return `url(${this.blog.media.logo.file})`;
      }
    }
  }

  ngOnInit(): void {
    BlogService.blog.pipe(untilComponentDestroyed(this)).subscribe((blog: BlogMin): void => {
      if (blog) {
        /**
         * Reset data
         */
        this.templateConfig = null;
        /**
         * Load blog data
         */
        this.blogService.getSettings().subscribe((data: BlogSettings): void => {
          this.blog = data;
        });
        /**
         * Load entries
         */
        this.entryService.getEntries({
          limit: MainComponent.POSTS_LIMIT,
        }).pipe(untilComponentDestroyed(this)).subscribe((response: ApiResponse<Entry>): void => {
          this.entries = response.results;
        });
        /**
         * Load comments
         */
        this.commentsService.getComments({
          limit: MainComponent.COMMENTS_LIMIT,
        }).pipe(untilComponentDestroyed(this)).subscribe((response: ApiResponse<Comment>): void => {
          this.comments = response.results;
        });
        /**
         * Load metrics
         */
        this.blogService.getMetrics().pipe(untilComponentDestroyed(this)).subscribe((data: Metrics): void => {
          this.metrics = data;
        });
        /**
         * Load template config (for owner and admins)
         */
        if (blog.role !== TeamRoles.Editor) {
          this.blogService.getTemplateConfig().pipe(
            untilComponentDestroyed(this),
          ).subscribe((data: { template_config: TemplateConfig }): void => {
            this.templateConfig = data.template_config;
          });
        }
      }
    });
  }

  /**
   * Show modal to show blog followers
   */
  showSubscribers() {
    this.subscriberModal = this.modalService.show(UsersModalComponent);
  }

  ngOnDestroy(): void {
  }
}
