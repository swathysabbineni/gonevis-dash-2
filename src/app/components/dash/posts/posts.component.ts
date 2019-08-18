import { Component, OnInit } from '@angular/core';
import { PostsService } from '@app/components/dash/posts/posts.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { Post } from '@app/interfaces/v1/post';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  posts: Post[];

  constructor(private post: PostsService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    /**
     * Load posts
     */
    this.post.getPosts().subscribe((response: ApiResponse<Post>): void => {
      this.posts = response.results;
    });
  }
}
