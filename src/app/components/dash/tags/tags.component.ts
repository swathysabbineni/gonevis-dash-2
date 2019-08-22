import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  /**
   * Blog tags
   */
  tags: Tag[];

  /**
   * Tag form
   */
  form: FormGroup;

  constructor(private tag: TagsService,
              private translate: TranslateService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    /**
     * Setup tag form
     */
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      slug: [''],
      description: [''],
    });
    /**
     * Get tags
     */
    this.getTags();
  }

  /**
   * Get tags
   */
  getTags(): void {
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
    tag.loading = true;
    this.tag.delete(tag.slug).subscribe((): void => {
      this.tags.splice(this.tags.indexOf(tag), 1);
    });
  }

  /**
   * Create tag for current blog
   */
  create(): void {
    this.tag.create(this.form.value.name, this.form.value.slug, this.form.value.description)
      .subscribe((): void => {
        this.form.reset();
        this.getTags();
      });
  }
}
