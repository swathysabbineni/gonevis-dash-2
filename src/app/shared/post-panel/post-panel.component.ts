import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EntryService } from '@app/components/dash/entry/entry.service';
import { EntryFormat } from '@app/enums/entry-format.enum';
import { EntryStatus } from '@app/enums/entry-status.enum';
import { ReactiveFormData } from '@app/interfaces/reactive-form-data';
import { Entry } from '@app/interfaces/v1/entry';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { UserService } from '@app/services/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post-panel',
  templateUrl: './post-panel.component.html',
  styleUrls: ['./post-panel.component.scss'],
})
export class PostPanelComponent implements OnInit {

  readonly entryStatus = EntryStatus;

  /**
   * Current blog to post as
   */
  blog: BlogMin;

  /**
   * Post form
   */
  form: ReactiveFormData = {
    error: {},
  };

  /**
   * Form focus status
   */
  focus: boolean;

  constructor(private entryService: EntryService,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private translate: TranslateService,
              private toast: ToastrService) {
  }

  ngOnInit(): void {
    if (UserService.hasBlogs) {
      this.blog = JSON.parse(JSON.stringify(UserService.user.sites)).reverse()[0];
    }
    /**
     * Setup post form
     */
    this.form.form = this.formBuilder.group({
      content: ['', Validators.required],
      status: [EntryStatus.Published, Validators.required],
    });
  }

  /**
   * Create a new post (status)
   */
  submit(): void {
    this.form.loading = true;
    this.entryService.create({
      status: this.form.form.get('status').value,
      content: this.form.form.get('content').value,
      format: EntryFormat.Status,
      site: this.blog.id,
      title: 'Status',
    }).subscribe((data: Entry): void => {
      this.form.loading = false;
      this.form.error = null;
      this.form.form.reset();
      if (data.status === EntryStatus.Published) {
        this.router.navigate(['../entry', data.id], { relativeTo: this.route.parent });
      } else {
        this.toast.info(this.translate.instant('TOAST_CREATE'), this.translate.instant('DRAFT'));
      }
    }, (error: HttpErrorResponse): void => {
      this.form.loading = false;
      this.form.error = error;
    });
  }

  /**
   * @returns Editor (write page) link for the blog
   */
  getEditorLink(): (string | number)[] {
    if (this.blog) {
      return ['/dash', BlogService.getBlogIndex(this.blog.id), 'write', 'new'];
    }
  }
}
