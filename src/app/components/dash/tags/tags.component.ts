import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TagsService } from '@app/components/dash/tags/tags.service';
import { ApiError } from '@app/interfaces/api-error';
import { ApiResponse } from '@app/interfaces/api-response';
import { Tag } from '@app/interfaces/v1/tag';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { TagModalComponent } from '@app/shared/tags-modal/tag-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private tag: TagsService,
              private translate: TranslateService,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: BsModalService,
              private toast: ToastrService) {
  }

  ngOnInit(): void {
    BlogService.blog.subscribe((blog: BlogMin): void => {
      if (blog) {
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
    });
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
      this.toast.info(this.translate.instant('TOAST_CREATE'), this.form.value.name || this.form.value.slug);
      this.getTags();
    }, (error): void => {
      this.loading = false;
      this.errors = error.error;
    });
  }

  /**
   * Add entry to navigations
   *
   * @param name Entry name
   * @param slug Entry slug
   */
  addToNavigation(name: string, slug: string): void {
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
}
