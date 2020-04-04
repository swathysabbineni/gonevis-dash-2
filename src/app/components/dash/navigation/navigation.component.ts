import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '@app/components/dash/navigation/navigation.service';
import { TeamRoles } from '@app/enums/team-roles';
import { ApiError } from '@app/interfaces/api-error';
import { Navigation } from '@app/interfaces/v1/navigation';
import { BlogService } from '@app/services/blog/blog.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faGripLinesVertical } from '@fortawesome/free-solid-svg-icons/faGripLinesVertical';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navs',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {

  readonly faAdd: IconDefinition = faPlus;
  readonly faBars: IconDefinition = faGripLinesVertical;
  readonly faDelete: IconDefinition = faTrash;

  /**
   * List of blog navigation
   */
  navigations: Navigation[];

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
              private route: ActivatedRoute,
              private navigationsService: NavigationService,
              private translate: TranslateService,
              private toast: ToastrService) {
  }

  ngOnInit(): void {
    this.isEditor = BlogService.currentBlog.role === TeamRoles.Editor;
    if (this.isEditor) {
      return;
    }
    /**
     * Get navigation
     */
    this.navigationsService.getNavigation().subscribe((data: { navigation: Navigation[] }): void => {
      this.navigations = data.navigation;
      /**
       * Watch router params
       */
      if (history.state.add) {
        this.navigations.push({
          label: history.state.add.label,
          url: history.state.add.url,
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
    for (const nav of this.navigations) {
      nav.sort_number = this.navigations.indexOf(nav);
    }
    this.navigationsService.update(this.navigations).subscribe((data: { navigation: Navigation[] }): void => {
      this.navigations = data.navigation;
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
    this.navigations.push({
      label: this.translate.instant('UNTITLED'),
      url: '/',
    });
  }

  /**
   * On navigation drop
   */
  drop(event: CdkDragDrop<Navigation[]>): void {
    moveItemInArray(this.navigations, event.previousIndex, event.currentIndex);
  }
}
