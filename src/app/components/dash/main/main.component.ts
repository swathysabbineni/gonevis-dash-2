import { Component, OnInit, OnDestroy } from '@angular/core';
import { SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CommentsService } from '@app/components/dash/comments/comments.service';
import { EntryService } from '@app/components/dash/entry/entry.service';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiResponse } from '@app/interfaces/api-response';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { Comment } from '@app/interfaces/v1/comment';
import { Entry } from '@app/interfaces/v1/entry';
import { Metrics } from '@app/interfaces/v1/metrics';
import { TemplateConfig } from '@app/interfaces/v1/template-config';
import { BlogService } from '@app/services/blog/blog.service';
import { UtilService } from '@app/services/util/util.service';
import { UsersModalComponent } from '@app/shared/users-modal/users-modal.component';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faEye } from '@fortawesome/free-regular-svg-icons/faEye';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons/faThumbsUp';
import { faComments } from '@fortawesome/free-solid-svg-icons/faComments';
import { faDatabase } from '@fortawesome/free-solid-svg-icons/faDatabase';
import { faThLarge } from '@fortawesome/free-solid-svg-icons/faThLarge';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { BsModalService } from 'ngx-bootstrap';
import { BytesPipe } from 'ngx-pipes';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [BytesPipe],
})
export class MainComponent implements OnInit, OnDestroy {

  private static readonly POSTS_LIMIT = 6;
  private static readonly COMMENTS_LIMIT = 8;

  readonly faPublications: IconDefinition = faThLarge;
  readonly faComments: IconDefinition = faComments;
  readonly faFollowers: IconDefinition = faUserPlus;
  readonly faFiles: IconDefinition = faDatabase;
  readonly eye: IconDefinition = faEye;
  readonly like: IconDefinition = faThumbsUp;

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
   * Metrics (data count, etc)
   */
  metrics: Metrics;

  /**
   * Template config data
   */
  templateConfig: TemplateConfig;

  constructor(private activatedRoute: ActivatedRoute,
              private utilService: UtilService,
              private blogService: BlogService,
              private entryService: EntryService,
              private commentsService: CommentsService,
              private modalService: BsModalService,
              private bytes: BytesPipe) {
  }

  /**
   * @returns Cover image or logo (CSS) of current blog
   */
  blogCover(): SafeStyle {
    if (this.blog) {
      if (this.blog.media.cover_image) {
        return this.utilService.sanitizeBackgroundImage(this.blog.media.cover_image.file);
      }
      if (this.blog.media.logo) {
        return this.utilService.sanitizeBackgroundImage(this.blog.media.logo.file);
      }
    }
  }

  /**
   * @returns Used and free storage in MB
   * @example 120.66 MB / 367.62 MB
   */
  storageTooltip(): string {
    if (this.metrics) {
      const USED = this.bytes.transform(this.metrics.metrics.dolphin.used_storage * 1000000, 2);
      const FREE = this.bytes.transform(this.metrics.metrics.dolphin.available_storage * 1000000, 2);
      return `${USED} / ${FREE}`;
    }
  }

  ngOnInit(): void {
    /**
     * Watch for current blog changes
     */
    this.activatedRoute.parent.parent.params.pipe(untilComponentDestroyed(this)).subscribe((): void => {
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
      }).subscribe((response: ApiResponse<Comment>): void => {
        this.comments = response.results;
      });
      /**
       * Load metrics
       */
      this.blogService.getMetrics().subscribe((data: Metrics): void => {
        this.metrics = data;
      });
      /**
       * Load template config (for owner and admins)
       */
      if (BlogService.currentBlog.role !== TeamRoles.Editor) {
        this.blogService.getTemplateConfig().subscribe((data: { template_config: TemplateConfig }): void => {
          this.templateConfig = data.template_config;
        });
      }
    });
  }

  /**
   * Show modal to show blog followers
   */
  showSubscribers(): void {
    this.modalService.show(UsersModalComponent);
  }

  ngOnDestroy(): void {
  }
}
