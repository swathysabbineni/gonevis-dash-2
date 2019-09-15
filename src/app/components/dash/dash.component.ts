import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
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
          } else {
            BlogService.setCurrent(blogs[0].id);
          }
        });
      });
    });
  }
}
