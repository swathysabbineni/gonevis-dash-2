import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { File } from '@app/interfaces/file';
import { Tag } from '@app/interfaces/v1/tag';
import { BlogService } from '@app/services/blog/blog.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

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
   * Tag form image
   */
  image: File;

  /**
   * Tag form API errors
   */
  errors: ApiError = {};

  /**
   * Tag form API loading indicator
   */
  loading: boolean;

  /**
   * File list modal
   */
  fileListModalRef: BsModalRef;

  constructor(public modal: BsModalRef,
              private modalService: BsModalService,
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
    /**
     * Show current tag image if there are
     */
    this.image = this.tag.media.cover_image;
  }

  /**
   * Update tag for current blog
   */
  update(): void {
    this.loading = true;
    if (this.image) {
      this.form.addControl('cover_image', new FormControl(this.image.id));
    }
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

  /**
   * Show file selection modal
   */
  showFileListModal(template: TemplateRef<any>) {
    this.fileListModalRef = this.modalService.show(template, {
      class: 'modal-lg',
    });
  }

  /**
   * On file selection
   *
   * @param file Selected file
   */
  onFileSelect(file: File) {
    this.fileListModalRef.hide();
    this.form.patchValue({
      cover_image: file.id,
    });
    this.image = file;
  }

  /**
   * Remove tag Cover image
   */
  removeCoverImage(): void {
    this.image = null;
    this.form.value.cover_image = null;
  }
}
