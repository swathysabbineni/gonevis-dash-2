import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { File, File as FileMedia } from '@app/interfaces/file';
import { Params } from '@app/interfaces/params';
import { BlogSettings } from '@app/interfaces/v1/blog-settings';
import { Tag } from '@app/interfaces/v1/tag';
import { BlogService } from '@app/services/blog/blog.service';
import { FileSelectionComponent } from '@app/shared/file-selection/file-selection.component';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-tag-modal',
  templateUrl: './tag-modal.component.html',
  styleUrls: ['./tag-modal.component.scss'],
})
export class TagModalComponent implements OnInit {

  readonly times: IconDefinition = faTimes;
  readonly trash: IconDefinition = faTrash;

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
  showFileListModal(): void {
    /**
     * Current tag's cover image ID.
     * It's being used for indicating selected image at file selection modal
     *
     * @see FileSelectionComponent.selected
     */
    let selected: string;
    /**
     * If image exists then update {@see selected} variable with image's ID
     */
    if (this.image) {
      selected = this.image.id;
    } else {
      selected = '';
    }
    /**
     * Show {@link FileSelectionComponent} as a modal and pass {@link selected} as modal
     * {@link initialState initial data}
     */
    const modal: BsModalRef = this.modalService.show(FileSelectionComponent, {
      class: 'modal-lg',
      initialState: {
        selected,
        selection: true,
      },
    });
    /**
     * On file select/choose update {@link form}'s `cover_image` control to have
     * chosen {@link file} ID.
     */
    modal.content.choose.subscribe((file: FileMedia): void => {
      this.form.patchValue({
        cover_image: file.id,
      });
      this.image = file;
    });
  }

  /**
   * Remove tag Cover image
   */
  removeCoverImage(): void {
    this.image = null;
    this.form.value.cover_image = null;
  }
}
