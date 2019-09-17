import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavsService } from '@app/components/dash/navs/navs.service';
import { ApiError } from '@app/interfaces/api-error';
import { Navigation } from '@app/interfaces/v1/navigation';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navs',
  templateUrl: './navs.component.html',
  styleUrls: ['./navs.component.scss'],
})
export class NavsComponent implements OnInit {

  /**
   * List of blog navigations
   */
  navigations: Navigation[];

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * API Errors
   */
  errors: ApiError[] = [];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private navsService: NavsService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    BlogService.blog.subscribe((blog: BlogMin): void => {
      if (blog) {
        /**
         * Get navigations
         */
        this.navsService.getNavigations().subscribe((data: { navigation: Navigation[] }): void => {
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
    });
  }

  /**
   * Update navigations
   */
  update(): void {
    this.loading = true;
    /**
     * Set navigation sorting number (based on index)
     */
    for (const nav of this.navigations) {
      nav.sort_number = this.navigations.indexOf(nav);
    }
    this.navsService.update(this.navigations).subscribe((data: { navigation: Navigation[] }): void => {
      this.navigations = data.navigation;
      this.loading = false;
      this.errors = [];
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
