import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { SidebarLink } from '@app/interfaces/sidebar-link';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage';
import { faNewspaper } from '@fortawesome/free-regular-svg-icons/faNewspaper';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons/faAngleDoubleLeft';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faComment } from '@fortawesome/free-solid-svg-icons/faComment';
import { faHashtag } from '@fortawesome/free-solid-svg-icons/faHashtag';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import { faThLarge } from '@fortawesome/free-solid-svg-icons/faThLarge';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit {

  /**
   * Angle double left icon
   */
  readonly faAngleDoubleLeft: IconDefinition = faAngleDoubleLeft;

  /**
   * Determines whether sidebar is closed or not
   */
  openSidebar: boolean;

  /**
   * Sidebar items
   */
  links: SidebarLink[] = [{
    path: 'main',
    label: 'DASHBOARD',
    icon: faTachometerAlt,
  }, {
    path: 'write',
    label: 'WRITE',
    icon: faPen,
  }, {
    path: 'posts',
    label: 'POSTS',
    icon: faThLarge,
  }, {
    path: 'pages',
    label: 'PAGES',
    icon: faNewspaper,
  }, {
    path: 'comments',
    label: 'COMMENTS',
    icon: faComment,
  }, {
    path: 'tags',
    label: 'TAGS',
    icon: faHashtag,
  }, {
    path: 'media',
    label: 'MEDIA',
    icon: faImage,
  }, {
    path: 'navs',
    label: 'NAVS',
    icon: faBars,
  }, {
    path: 'team',
    label: 'TEAM',
    icon: faUser,
  }, {
    path: 'settings',
    label: 'SETTINGS',
    icon: faCog,
  }, {
    path: 'help',
    label: 'HELP',
    icon: faInfoCircle,
  }];

  constructor(private route: ActivatedRoute) {
    if (JSON.parse(localStorage.getItem('sidebar')) === null) {
      this.toggleSidebar();
    } else {
      this.openSidebar = JSON.parse(localStorage.getItem('sidebar'));
    }
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
          if (index && blogs[index]) {
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

  /**
   * Toggle sidebar and update local storage value
   */
  toggleSidebar(): void {
    localStorage.setItem('sidebar', String(!this.openSidebar));
    this.openSidebar = !this.openSidebar;
  }
}
