import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SidebarLink } from '@app/interfaces/sidebar-link';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons/faNewspaper';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment';
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import { faThLarge } from '@fortawesome/free-solid-svg-icons/faThLarge';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit {

  /**
   * Sidebar items
   */
  links: SidebarLink[] = [{
    path: 'main',
    label: this.translateService.instant('DASHBOARD'),
    icon: faTachometerAlt,
  }, {
    path: 'write',
    label: this.translateService.instant('WRITE'),
    icon: faPen,
  }, {
    path: 'posts',
    label: this.translateService.instant('POSTS'),
    icon: faThLarge,
  }, {
    path: 'pages',
    label: this.translateService.instant('PAGES'),
    icon: faNewspaper,
  }, {
    path: 'comments',
    label: this.translateService.instant('COMMENTS'),
    icon: faComment,
  }, {
    path: 'tags',
    label: this.translateService.instant('TAGS'),
    icon: faHashtag,
  }, {
    path: 'media',
    label: this.translateService.instant('MEDIA'),
    icon: faImage,
  }, {
    path: 'navs',
    label: this.translateService.instant('NAVS'),
    icon: faBars,
  }, {
    path: 'team',
    label: this.translateService.instant('TEAM'),
    icon: faUser,
  }, {
    path: 'settings',
    label: this.translateService.instant('SETTINGS'),
    icon: faCog,
  }, {
    path: 'help',
    label: this.translateService.instant('HELP'),
    icon: faInfoCircle,
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
          } else if (blogs && blogs.length) {
            BlogService.setCurrent(blogs[0].id);
          } else {
            BlogService.setCurrent(null);
          }
        });
      });
    });
  }
}
