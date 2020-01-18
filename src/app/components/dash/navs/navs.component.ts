import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavsService } from '@app/components/dash/navs/navs.service';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiError } from '@app/interfaces/api-error';
import { Navigation } from '@app/interfaces/v1/navigation';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons/faGripLinesVertical';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateService } from '@ngx-translate/core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navs',
  templateUrl: './navs.component.html',
  styleUrls: ['./navs.component.scss'],
})
export class NavsComponent implements OnInit, OnDestroy {

  readonly plus: IconDefinition = faPlus;
  readonly gripLinesVertical: IconDefinition = faGripLinesVertical;
  readonly trush: IconDefinition = faTrash;
  /**
   * List of blog navigation
   */
  navs: Navigation[];

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * API errors
   */
  errors: ApiError[] = [];

  /**
   * Determines whether or not the user's role in current blog is editor
   */
  isEditor: boolean;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private navsService: NavsService,
              private translate: TranslateService,
              private toast: ToastrService) {
  }

  ngOnInit(): void {
    BlogService.blog.pipe(untilComponentDestroyed(this)).subscribe((blog: BlogMin): void => {
      if (blog) {
        this.isEditor = BlogService.currentBlog.role === TeamRoles.Editor;
        if (this.isEditor) {
          return;
        }
        /**
         * Get navigation
         */
        this.navsService.getNavs().subscribe((data: { navigation: Navigation[] }): void => {
          this.navs = data.navigation;
          /**
           * Watch router params
           */
          if (history.state.add) {
            this.navs.push({
              label: history.state.add.label,
              url: history.state.add.url,
            });
          }
        });
      }
    });
  }

  /**
   * Update navigation
   */
  update(): void {
    this.loading = true;
    /**
     * Set navigation sorting number (based on index)
     */
    for (const nav of this.navs) {
      nav.sort_number = this.navs.indexOf(nav);
    }
    this.navsService.update(this.navs).subscribe((data: { navigation: Navigation[] }): void => {
      this.navs = data.navigation;
      this.loading = false;
      this.errors = [];
      this.toast.info(this.translate.instant('TOAST_UPDATE'), this.translate.instant('NAVIGATION'));
    }, (error) => {
      this.loading = false;
      this.errors = error.error.navigation;
    });
  }

  /**
   * Add new navigation
   */
  add(): void {
    this.navs.push({
      label: this.translate.instant('UNTITLED'),
      url: '/',
    });
  }

  /**
   * On navigation drop
   */
  drop(event: CdkDragDrop<Navigation[]>): void {
    moveItemInArray(this.navs, event.previousIndex, event.currentIndex);
  }

  ngOnDestroy(): void {
  }
}
