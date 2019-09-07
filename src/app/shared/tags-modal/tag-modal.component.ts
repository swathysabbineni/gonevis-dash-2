import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { Tag } from '@app/interfaces/v1/tag';
import { BlogService } from '@app/services/blog/blog.service';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-tag-modal',
  templateUrl: './tag-modal.component.html',
  styleUrls: ['./tag-modal.component.scss'],
})
export class TagModalComponent implements OnInit {

  /**
   * Editing tag
   */
  tag: Tag;

  /**
   * Tag form
   */
  form: FormGroup;

  /**
   * Tag form API errors
   */
  errors: ApiError = {};

  /**
   * Tag form API loading indicator
   */
  loading: boolean;

  constructor(public modal: BsModalRef,
              private formBuilder: FormBuilder,
              private blogService: BlogService) {
  }

  ngOnInit(): void {
    /**
     * Setup tag form
     */
    this.form = this.formBuilder.group({
      name: [this.tag.name, Validators.required],
      slug: [this.tag.slug],
      description: [this.tag.description],
    });
  }

  /**
   * Update tag for current blog
   */
  update(): void {
    this.loading = true;
    this.blogService.updateTag(this.tag.slug, this.form.value).subscribe((data: Tag): void => {
      this.loading = false;
      this.errors = {};
      this.tag = Object.assign(this.tag, data);
      this.modal.hide();
    }, (error): void => {
      this.loading = false;
      this.errors = error.error;
    });
  }
}
