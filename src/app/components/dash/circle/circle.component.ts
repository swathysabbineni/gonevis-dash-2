import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CircleService } from '@app/components/dash/circle/circle.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { ReactiveFormData } from '@app/interfaces/reactive-form-data';
import { Circle } from '@app/interfaces/v1/circle';
import { CircleMin } from '@app/interfaces/v1/circle-min';
import { Subscriber } from '@app/interfaces/v1/subscriber';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { UtilService } from '@app/services/util/util.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
})
export class CircleComponent implements OnInit {

  readonly faDelete: IconDefinition = faTrash;
  readonly faBack: IconDefinition = faArrowLeft;
  readonly faEdit: IconDefinition = faPencilAlt;
  readonly faCircles: IconDefinition = faSpinner;

  /**
   * Info banner visibility
   */
  infoBannerDismissed: boolean;

  /**
   * List of blog circles
   */
  circles: CircleMin[];

  /**
   * Extra data for blog circles
   * Key is circle ID.
   */
  circlesData: Record<string, {
    members: Subscriber[],
    membersCount: number,
  }> = {};

  /**
   * Selected circle which is being used to display a circle and it's members.
   */
  selectedCircle: { circle: CircleMin, members: ApiResponse<Subscriber> } = {
    circle: null,
    members: null,
  };

  /**
   * Determines whether or not the user is editing a circle.
   * If `true` it will show a form for editing a circle.
   */
  isEditing: boolean;

  /**
   * Determines whether or not we are saving circle changes.
   */
  savingCircle: boolean;

  /**
   * Loading indicator for getting a single circle.
   */
  loading: boolean;

  /**
   * Form data
   */
  form: ReactiveFormData = { error: {} };

  /**
   * Search form
   */
  formSearch: FormGroup;

  /**
   * Form being used to edit a single circle.
   */
  circleForm: FormGroup;

  /**
   * Available circle members
   */
  availableCircleMembers: Subscriber[] = [];

  /**
   * Determines whether or not dragging started
   */
  dragStarted: boolean;

  constructor(public util: UtilService,
              private changeDetectorRef: ChangeDetectorRef,
              private circleService: CircleService,
              private formBuilder: FormBuilder,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    /**
     * Setup form
     */
    this.form.form = this.formBuilder.group({
      name: ['', Validators.required],
    });
    /**
     * Setup search form
     */
    this.formSearch = this.formBuilder.group({
      search: [''],
      circleMemberSearch: [''],
    });
    /**
     * Setup circle form
     */
    this.circleForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
    });
    /**
     * Load the circles
     */
    this.circleService.list().subscribe((data: ApiResponse<CircleMin>): void => {
      this.circles = data.results;
      /**
       * Load circle members
       */
      for (const circle of this.circles) {
        this.circlesData[circle.id] = {
          membersCount: 0,
          members: [],
        };
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
    this.loadAvailableCircleMembers();
  }

  /**
   * Load available members
   */
  loadAvailableCircleMembers(search: string = '') {
    this.circleService.getAvailableMembers(search).subscribe((data: ApiResponse<Subscriber>): void => {
      this.availableCircleMembers = data.results;
    });
  }

  /**
   * On circle member drop capture member ID from {@see DataTransfer}
   */
  onCircleDrop(event: DragEvent, circle: CircleMin): void {
    // Break code if dropped item doesn't have an ID, it means it's not a user.
    if (!event.dataTransfer.getData('id')) {
      return;
    }
    event.preventDefault();
    /**
     * Remove drag indicator for the circle
     */
    this.circleDragIndicator(event, false);
    /**
     * Notify circles that dragging ended
     */
    this.dragStarted = false;
    /**
     * Find member with that ID
     */
    const member: Subscriber = this.availableCircleMembers.find((item: Subscriber): boolean => {
      return item.id === event.dataTransfer.getData('id');
    });
    /**
     * Add member to circle
     */
    if (!this.isCircleMember(circle.id, member.id)) {
      this.circleService.addMember(circle.id, member.id).subscribe((): void => {
        this.circlesData[circle.id].membersCount++;
        this.circlesData[circle.id].members.push(member);
      });
    }
  }

  /**
   * Being used to add .drag-entered class to a specific circle based on
   * {@link DragEvent.target DragEvent target} element
   *
   * @param event DragEvent
   * @param add Whether to add .drag-entered class or not
   */
  circleDragIndicator(event: DragEvent, add: boolean): void {
    /**
     * Get circle element based on {@link DragEvent}
     */
    const circleElement: HTMLElement = (event.target as HTMLElement);
    /**
     * Remove/add .drag-entered class to {@link circleElement} based on given parameter
     */
    if (add) {
      circleElement.classList.add('drag-entered');
    } else {
      circleElement.classList.remove('drag-entered');
    }
  }

  /**
   * On member dragging started set ID as specified data
   *
   * @param event Drag event
   * @param member Member ID to set as data for dragging event
   */
  onMemberDragStart(event: DragEvent, member: string): void {
    /**
     * Set member ID as specified data
     */
    event.dataTransfer.setData('id', member);
    /**
     * Notify circles that dragging started
     */
    this.dragStarted = true;
  }

  /**
   * @returns Whether this member os part of this circle or not
   */
  isCircleMember(circleId: string, memberId: string): boolean {
    return this.circlesData[circleId].members.some(member => member.id === memberId);
  }

  /**
   * Remove a member from a circle
   */
  removeMember(memberId: string): void {
    const circleId: string = this.selectedCircle.circle.id;
    this.circleService.removeMember(circleId, memberId).subscribe((): void => {
      /**
       * Decrease member count
       */
      this.circlesData[circleId].membersCount--;
      this.selectedCircle.members.count--;
      /**
       * Remove member from both selected and main circles.
       */
      this.circlesData[circleId].members = this.circlesData[circleId].members
        .filter((member: Subscriber): boolean => member.id !== memberId);
      this.selectedCircle.members.results = this.selectedCircle.members.results
        .filter((member: Subscriber): boolean => member.id !== memberId);
    });
  }

  /**
   * Submit form
   */
  submit(): void {
    this.form.loading = true;
    this.circleService.create(this.form.form.value).subscribe((data: Circle): void => {
      this.circles.push({
        id: data.id,
        name: data.name,
        description: data.description,
      });
      this.circlesData[data.id] = {
        membersCount: 0,
        members: [],
      };
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
      /**
       * Remove selected circle
       */
      if (circle.id === this.selectedCircle.circle.id) {
        this.selectedCircle = {
          circle: null,
          members: null,
        };
      }
    });
  }

  /**
   * View a circle
   */
  viewCircle(circle: CircleMin): void {
    this.cancelEdit();
    this.loading = true;
    this.selectedCircle.circle = circle;
    this.formSearch.get('circleMemberSearch').setValue('');
    this.circleService.getMembers(circle.id).subscribe((members: ApiResponse<Subscriber>): void => {
      this.loading = false;
      this.selectedCircle.members = members;
    }, (): void => {
      this.loading = false;
    });
  }

  /**
   * Search circle members.
   *
   * @param search Search text
   */
  searchCircleMembers(search: string = ''): void {
    this.circleService.getMembers(this.selectedCircle.circle.id, {
      search,
    }).subscribe((members: ApiResponse<Subscriber>): void => {
      this.selectedCircle.members = members;
    });
  }

  /**
   * Being used to show editing form for circle.
   */
  startEditingCircle(): void {
    this.circleForm.patchValue({
      name: this.selectedCircle.circle.name,
      description: this.selectedCircle.circle.description,
    });
    this.isEditing = true;
  }

  /**
   * Cancel editing a circle and reset {@link circleForm circle form}.
   */
  cancelEdit(): void {
    this.circleForm.reset();
    this.isEditing = false;
  }

  /**
   * Update selected circle
   */
  updateCircle(): void {
    // Prevent API call if form was invalid.
    if (this.circleForm.invalid) {
      return;
    }
    this.savingCircle = true;
    this.circleService.update(this.selectedCircle.circle.id, this.circleForm.value)
      .subscribe((data: CircleMin): void => {
        this.cancelEdit();
        // Find circle in the list and update its properties.
        const circle: CircleMin = this.circles.find((circleMin: CircleMin): boolean => {
          return circleMin.id === this.selectedCircle.circle.id;
        });
        if (circle) {
          circle.name = data.name;
          circle.description = data.description;
        }
        this.savingCircle = false;
      }, (): void => {
        this.savingCircle = false;
      });
  }

  /**
   * Dismiss info banner and detect changes to update UI on time.
   */
  dismissInfoBanner(): void {
    this.infoBannerDismissed = true;
    this.changeDetectorRef.detectChanges();
  }
}
