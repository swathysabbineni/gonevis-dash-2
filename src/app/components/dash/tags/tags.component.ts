import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TagsService } from '@app/components/dash/tags/tags.service';
import { ApiError } from '@app/interfaces/api-error';
import { ApiResponse } from '@app/interfaces/api-response';
import { File } from '@app/interfaces/file';
import { Pagination } from '@app/interfaces/pagination';
import { Tag } from '@app/interfaces/v1/tag';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { TagModalComponent } from '@app/shared/tags-modal/tag-modal.component';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateService } from '@ngx-translate/core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit, OnDestroy {

  readonly ellipsis: IconDefinition = faEllipsisV;
  readonly trash: IconDefinition = faTrash;

  /**
   * Current search text
   */
  search: string;

  /**
   * Blog tags
   */
  tags: Tag[];

  /**
   * API pagination data
   */
  pagination: Pagination = {
    itemsPerPage: TagsService.PAGE_SIZE,
    totalItems: 0,
    currentPage: 1,
  };

  /**
   * Tag form
   */
  form: FormGroup;

  /**
   * Tag form image
   */
  image: File;

  /**
   * Tags modal to edit tags
   */
  tagsModal: BsModalRef;

  /**
   * Tag form API loading indicator
   */
  loading: boolean;

  /**
   * Tag form API errors
   */
  errors: ApiError = {};

  /**
   * File list modal
   */
  fileListModalRef: BsModalRef;

  constructor(private tag: TagsService,
              private translate: TranslateService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: BsModalService,
              private toast: ToastrService) {
  }

  ngOnInit(): void {
    BlogService.blog.pipe(untilComponentDestroyed(this)).subscribe((blog: BlogMin): void => {
      if (blog) {
        /**
         * Setup tag form
         */
        this.form = this.formBuilder.group({
          name: ['', Validators.required],
          slug: [''],
          description: [''],
          cover_image: [''],
        });
        /**
         * Get tags
         */
        this.getTags();
      }
    });
  }

  /**
   * Get tags
   *
   * @param page API number
   */
  getTags(page: number = 1): void {
    this.pagination.currentPage = page;
    this.loading = true;
    this.tag.getTags(page, this.search || '').subscribe((response: ApiResponse<Tag>): void => {
      this.pagination.totalItems = response.count;
      this.tags = response.results;
      this.loading = false;
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
      this.toast.info(this.translate.instant('TOAST_DELETE'), tag.slug || tag.slug);
      this.tags.splice(this.tags.indexOf(tag), 1);
    });
  }

  /**
   * Create tag for current blog
   */
  create(): void {
    this.loading = true;
    this.tag.create(this.form.value).subscribe((): void => {
      this.loading = false;
      this.errors = {};
      this.form.reset();
      this.image = null;
      this.toast.info(this.translate.instant('TOAST_CREATE'), this.form.value.name || this.form.value.slug);
      this.getTags();
    }, (error): void => {
      this.loading = false;
      this.errors = error.error;
    });
  }

  /**
   * Add entry to navigation
   *
   * @param name Entry name
   * @param slug Entry slug
   */
  addToNavs(name: string, slug: string): void {
    this.router.navigate(['navs'], {
      relativeTo: this.route.parent.parent,
      state: {
        add: {
          label: name,
          url: `/${slug}`,
        },
      },
    });
  }

  /**
   * Show modal to edit tag
   */
  showTagModal(tag: Tag) {
    this.tagsModal = this.modalService.show(TagModalComponent, {
      class: 'modal-sm',
      initialState: { tag },
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

  ngOnDestroy(): void {
  }
}
