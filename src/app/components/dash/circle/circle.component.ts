import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CircleService } from '@app/components/dash/circle/circle.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { ReactiveFormData } from '@app/interfaces/reactive-form-data';
import { Circle } from '@app/interfaces/v1/circle';
import { CircleMin } from '@app/interfaces/v1/circle-min';
import { Subscriber } from '@app/interfaces/v1/subscriber';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
})
export class CircleComponent implements OnInit {

  faDelete: IconDefinition = faTrash;

  /**
   * List of blog circles
   */
  circles: CircleMin[];

  /**
   * Extra data for blog circles
   * Key is circle ID.
   */
  circlesData: {
    [circle: string]: {
      members: Subscriber[],
      membersCount: number,
    }
  } = {};

  /**
   * Form data
   */
  form: ReactiveFormData = { error: {} };

  /**
   * Available circle members
   */
  availableCircleMembers: Subscriber[] = [];

  constructor(private circleService: CircleService,
              private formBuilder: FormBuilder,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    /**
     * Setup form
     */
    this.form.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      member_ids: [],
    });
    /**
     * Load the circles
     */
    this.circleService.list().subscribe((data: CircleMin[]): void => {
      this.circles = data;
      /**
       * Load circle members
       */
      for (const circle of this.circles) {
        this.circlesData[circle.id].membersCount = 0;
        this.circlesData[circle.id].members = [];
        this.circleService.getMembers(circle.id, {
          limit: 8,
        }).subscribe((members: ApiResponse<Subscriber>): void => {
          this.circlesData[circle.id].membersCount = members.count;
          this.circlesData[circle.id].members = members.results;
        });
      }
    });
    /**
     * Load available members
     */
    this.circleService.getAvailableMembers().subscribe((data: ApiResponse<Subscriber>): void => {
      this.availableCircleMembers = data.results;
    });
  }

  /**
   * Submit form
   */
  submit(): void {
    this.form.loading = true;
    const payload = this.form.form.value;
    delete payload.member_ids;
    this.circleService.create(
      payload,
      this.form.form.get('member_ids').value,
    ).subscribe((data: Circle): void => {
      this.circles.unshift(data);
      this.circlesData[data.id].membersCount = 0;
      this.circlesData[data.id].members = [];
      this.form.form.reset();
      this.form.loading = false;
      this.form.error = {};
    }, (data: HttpErrorResponseApi): void => {
      this.form.loading = false;
      this.form.error = data.error;
    });
  }

  /**
   * Delete a circle
   */
  delete(circle: CircleMin): void {
    if (!confirm(this.translate.instant('CONFIRM_DELETE_CIRCLE'))) {
      return;
    }
    this.circleService.delete(circle.id).subscribe((): void => {
      this.circles.splice(this.circles.indexOf(circle), 1);
    });
  }
}
