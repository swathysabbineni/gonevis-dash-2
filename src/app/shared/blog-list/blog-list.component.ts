import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiResponse } from '@app/interfaces/api-response';
import { Blog } from '@app/interfaces/zero/blog';
import { ApiService } from '@app/services/api/api.service';
import { EntryService } from '@app/services/entry/entry.service';
import { UtilService } from '@app/services/util/util.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent {

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * List of blogs
   */
  @Input() blogs: Blog[];

  /**
   * Next page endpoint
   */
  @Input() next: string;

  constructor(private activatedRoute: ActivatedRoute,
              private entryService: EntryService,
              private apiService: ApiService,
              public utils: UtilService) {
  }

  /**
   * Load more
   *
   * @param endpoint Next page endpoint
   */
  loadMore(endpoint: string): void {
    if (!this.next || this.loading) {
      return;
    }
    this.loading = true;
    this.apiService.getEndpoint<Blog>(endpoint).subscribe((data: ApiResponse<Blog>): void => {
      this.next = data.next;
      this.loading = false;
      data.results.map((blog: Blog): void => {
        this.blogs.push(blog);
      });
    });
  }
}
