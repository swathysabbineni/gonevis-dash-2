import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SidebarLink } from '@app/interfaces/sidebar-link';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit {

  /**
   * Sidebar links
   */
  links: SidebarLink[] = [{
    path: 'main',
    label: this.translateService.instant('DASHBOARD'),
    icon: 'home',
  }, {
    path: 'write',
    label: this.translateService.instant('WRITE'),
    icon: 'keyboard',
  }, {
    path: 'posts',
    label: this.translateService.instant('POSTS'),
    icon: 'scroll',
  }, {
    path: 'pages',
    label: this.translateService.instant('PAGES'),
    icon: 'newspaper',
  }, {
    path: 'comments',
    label: this.translateService.instant('COMMENTS'),
    icon: 'comments',
  }, {
    path: 'tags',
    label: this.translateService.instant('TAGS'),
    icon: 'tags',
  }, {
    path: 'media',
    label: this.translateService.instant('MEDIA'),
    icon: 'photo-video',
  }, {
    path: 'navs',
    label: this.translateService.instant('NAVS'),
    icon: 'bars',
  }, {
    path: 'team',
    label: this.translateService.instant('TEAM'),
    icon: 'users',
  }, {
    path: 'settings',
    label: this.translateService.instant('SETTINGS'),
    icon: 'cog',
  }];

  constructor(private route: ActivatedRoute,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    /**
     * Get blog list (and watch for changes)
     */
    BlogService.blogs.subscribe((blogs: BlogMin[]): void => {
      setTimeout(() => {
        /**
         * Get blog index from param (and watch for changes)
         */
        this.route.params.subscribe((params: Params) => {
          const index: number = Number(params.blog);
          if (index) {
            BlogService.setCurrent(blogs[index].id);
          } else if (blogs) {
            BlogService.setCurrent(blogs[0].id);
          }
        });
      });
    });
  }
}
