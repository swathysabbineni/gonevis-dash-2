import { Component, OnInit } from '@angular/core';
import { TagsService } from '@app/components/dash/tags/tags.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { Tag } from '@app/interfaces/v1/tag';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {

  tags: Tag[];

  /**
   * API loading indicator
   */
  loading: boolean;

  constructor(private tag: TagsService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    /**
     * Load tags
     */
    this.tag.getTags().subscribe((response: ApiResponse<Tag>): void => {
      this.tags = response.results;
    });
  }

  /**
   * Delete tag for current blog
   */
  delete(tag: Tag): void {
    if (!confirm(this.translate.instant('CONFORM_DELETE_TAG'))) {
      return;
    }
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.tag.delete(tag.slug).subscribe((): void => {
      this.loading = false;
      this.tags.splice(this.tags.indexOf(tag), 1);
    });
  }
}
