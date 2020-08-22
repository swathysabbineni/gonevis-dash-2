import { trigger, transition, query, style, stagger, animate, sequence } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faUser } from '@fortawesome/free-solid-svg-icons/faUser';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons/faUserFriends';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { CircleCreateDialogComponent } from 'src/app/components/dash/circle/circle-create-dialog/circle-create-dialog.component';
import { CircleEditDialogComponent } from 'src/app/components/dash/circle/circle-edit-dialog/circle-edit-dialog.component';
import { CircleCreated } from 'src/app/interfaces/circle-created';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-modal/confirmation-dialog.component';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
  animations: [
    trigger('scaleIn', [
      transition('void => *', [
        query('.circle-member', [
          style({ transform: 'scale(0.5)', opacity: 0 }),
          stagger(75, [
            animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: '*', opacity: '1' })),
          ]),
        ], { optional: true }),
      ]),
      transition('* => void', [
        query('.circle-member', [
          style({ opacity: '1' }),
          animate('100ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 0 })),
        ], { optional: true }),
      ]),
      transition('* => *', [
        query(':enter', [
          style({ transform: 'scale(0.5)', opacity: 0 }),
          stagger(75, [
            animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: '*', opacity: '1' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
    trigger('onMemberAdd', [
      transition('void => *', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        sequence([
          animate('0.3s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(-100px)' })),
          animate('1s', style({ opacity: 1, transform: 'translateY(-100px)' })),
          animate('.2s ease', style({ opacity: 0 })),
        ]),
      ]),
    ]),
    trigger('onMembersLoaded', [
      transition('void => *', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('onCircleChange', [
      transition('* => void', [
        style({ opacity: 1, height: '*' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, height: '0' })),
      ]),
      transition('void => *', [
        style({ opacity: 0, height: '0' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, height: '*' })),
      ]),
    ]),
    trigger('onReveal', [
      transition('* => void', [
        style({ opacity: 1, height: '*', width: '*', margin: '*', transform: 'scale(1)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({
          opacity: 0,
          height: '0',
          width: '0',
          margin: '0',
          transform: 'scale(0)',
        })),
      ]),
      transition('void => *', [
        style({ opacity: 0, height: '0', width: '0', margin: '0', transform: 'scale(0)' }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({
          opacity: 1,
          height: '*',
          width: '*',
          margin: '*',
          transform: 'scale(1)',
        })),
      ]),
    ]),
    trigger('onMemberRemove', [
      transition('* => void', [
        style({ opacity: 1, flexBasis: '*', width: '*', margin: '*' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({
          opacity: 0,
          width: '0',
          margin: '0',
          flexBasis: '0',
        })),
      ]),
    ]),
    trigger('onSearch', [
      transition('* => void', [
        style({ opacity: 1, transform: 'scale(1)' }),
        animate('175ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, transform: 'scale(0)' })),
      ]),
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0)' }),
        animate('175ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
    trigger('onCircleListChange', [
      transition(':increment', [
        query(':enter', [
          style({ transform: 'scale(0.5)', width: 0, height: 0, opacity: 0 }),
          stagger(300, [
            animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({
              transform: '*',
              width: '*',
              height: '*',
              opacity: '1',
            })),
          ]),
        ], { optional: true }),
      ]),
      transition(':decrement', [
        query(':leave', [
          style({ transform: 'scale(1)', width: '*', height: '*', opacity: 1 }),
          animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({
            transform: 'scale(0)',
            width: '0',
            height: '0',
            opacity: 0,
          })),
        ], { optional: true }),
      ]),
      transition('* => *', [
        query(':enter', [
          style({ transform: 'scale(0.5)', opacity: 0 }),
          stagger(75, [
            animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({ transform: '*', opacity: '1' })),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ],
})
export class CircleComponent implements OnInit {

  readonly faDelete: IconDefinition = faTrash;
  readonly faBack: IconDefinition = faArrowLeft;
  readonly faEdit: IconDefinition = faPencilAlt;
  readonly faCircles: IconDefinition = faSpinner;
  readonly faPlus: IconDefinition = faPlus;
  readonly faUser: IconDefinition = faUser;
  readonly faUserFriends: IconDefinition = faUserFriends;
  readonly faCheck: IconDefinition = faCheck;
  readonly faSearch: IconDefinition = faSearch;
  readonly faTimes: IconDefinition = faTimes;

  triggerIt: boolean;

  /**
   * Get template reference responsible for holding drag preview.
   */
  @ViewChild('dragPreviewTemplateRef') private dragPreviewTemplateRef: ElementRef<HTMLDivElement>;

  /**
   * Selection model is a class which will select/deselect items and other functionalities.
   */
  selection: SelectionModel<Subscriber> = new SelectionModel<Subscriber>(true, []);

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
    hovered: boolean,
    inDetail: boolean,
    added: {
      count: number,
      showInfo: boolean,
    }
  }> = {};

  /**
   * Selected circle which is being used to display a circle and it's members.
   */
  selectedCircle: { circle: CircleMin, members: ApiResponse<Subscriber> } = {
    circle: null,
    members: null,
  };

  circlesWithMember: string[] = [];

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
   * Loading indicator for searching.
   */
  searching: boolean;

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

  /**
   * Stores last member selected/deselected. It's being used for multi selecting followers with SHIFT Click.
   */
  lastSelection: Subscriber;

  constructor(public util: UtilService,
              private changeDetectorRef: ChangeDetectorRef,
              private circleService: CircleService,
              private formBuilder: FormBuilder,
              private dialog: MatDialog,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.selection.changed.subscribe((): void => {
      this.changeDetectorRef.detectChanges();
    });
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
          hovered: false,
          inDetail: false,
          added: {
            count: 0,
            showInfo: false,
          },
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
    this.selection.clear();
    this.searching = true;
    this.circleService.getAvailableMembers(search).subscribe((data: ApiResponse<Subscriber>): void => {
      this.availableCircleMembers = data.results;
      this.searching = false;
    }, (): void => {
      this.searching = false;
    });
  }

  /**
   * On circle member drop capture member ID from {@see DataTransfer}.
   */
  onCircleDrop(event: DragEvent, circle: CircleMin): void {
    const selected: Subscriber[] = this.selection.selected;
    // Break code if dropped item doesn't have an ID, it means it's not a user.
    if (!event.dataTransfer.getData('id')) {
      return;
    }
    this.selection.clear();
    event.preventDefault();
    /**
     * Remove drag indicator for the circle.
     */
    this.circleDragIndicator(event, false, circle.id);
    this.circlesData[circle.id].hovered = true;
    /**
     * Notify circles that dragging ended.
     */
    this.dragStarted = false;
    /**
     * List of observables which their type is {@link BehaviorSubject} that hold boolean as value.
     */
    const observableList: BehaviorSubject<boolean>[] = [];
    if (selected.length > 1) {
      selected.forEach((member: Subscriber): void => {
        /**
         * Add member to circle
         */
        if (!this.isCircleMember(circle.id, member.id)) {
          /**
           * Create a [behavior subject]{@link BehaviorSubject} with `false` as its default value.
           */
          const statusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
          observableList.push(statusSubject);
          this.addMember(circle.id, member, statusSubject);
        }
      });
    } else {
      /**
       * Find member with that ID.
       */
      const member: Subscriber = this.availableCircleMembers.find((item: Subscriber): boolean => {
        return item.id === event.dataTransfer.getData('id');
      });
      /**
       * Add member to circle
       */
      if (!this.isCircleMember(circle.id, member.id)) {
        /**
         * Create a [behavior subject]{@link BehaviorSubject} with `false` as its default value.
         */
        const statusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
        observableList.push(statusSubject);
        this.addMember(circle.id, member, statusSubject);
      }
    }
    /**
     * Wait for all observables to be done and show number of members that successfully has been added to the circle.
     */
    forkJoin(observableList).subscribe((data: boolean[]): void => {
      this.circlesData[circle.id].added = {
        count: data.length,
        showInfo: true,
      };
    });
  }

  onAddMemberDrop(event: DragEvent): void {
    const selected: Subscriber[] = this.selection.selected;
    // Break code if dropped item doesn't have an ID, it means it's not a user.
    if (!event.dataTransfer.getData('id')) {
      return;
    }
    this.selection.clear();
    event.preventDefault();
    /**
     * Remove drag indicator for the button.
     */
    this.circleDragIndicator(event, false, null);
    /**
     * Notify circles that dragging ended.
     */
    this.dragStarted = false;
    this.showCircleCreateDialog(selected);
  }

  /**
   * Add a member to a circle.
   *
   * @param circleId Circle ID to update circle's members.
   * @param member Member to update circle's members list.
   * @param behaviorSubject Subject to determine whether or not member successfully was added.
   */
  addMember(circleId: string, member: Subscriber, behaviorSubject: BehaviorSubject<boolean>): void {
    this.circleService.addMember(circleId, member.id).subscribe((): void => {
      this.circlesData[circleId].membersCount++;
      this.circlesData[circleId].members.push(member);
      behaviorSubject.next(true);
      behaviorSubject.complete();
    }, (): void => {
      behaviorSubject.complete();
    });
  }

  /**
   * Being used to add .drag-entered class to a specific circle based on
   * {@link DragEvent.target DragEvent target} element
   *
   * @param event DragEvent
   * @param add Whether to add .drag-entered class or not
   * @param circleId Circle ID
   */
  circleDragIndicator(event: DragEvent, add: boolean, circleId: string): void {
    /**
     * Get circle element based on {@link DragEvent}
     */
    const circleElement: HTMLElement = (event.target as HTMLElement);
    /**
     * Remove/add .drag-entered class to {@link circleElement} based on given parameter
     */
    if (add) {
      circleElement.classList.add('drag-entered');
      if (circleId) {
        this.circlesData[circleId].hovered = true;
      }
    } else {
      circleElement.classList.remove('drag-entered');
      if (circleId) {
        this.circlesData[circleId].hovered = false;
      }
    }
  }

  /**
   * On member dragging started set ID as specified data
   *
   * @param event Drag event
   * @param member Member to set its ID as data for dragging event
   */
  onMemberDragStart(event: DragEvent, member: Subscriber): void {
    if (!event.ctrlKey && !this.selection.isSelected(member)) {
      this.selection.clear();
    }
    this.selection.select(member);
    event.dataTransfer.setDragImage(new Image(), 0, 0);
    /**
     * Set member ID as specified data
     */
    event.dataTransfer.setData('id', member.id);
    /**
     * Notify circles that dragging started
     */
    this.dragStarted = true;
    setTimeout(() => {
      this.circlesWithMember = [];
      this.changeDetectorRef.detectChanges();
    }, 100);
  }

  /**
   * @returns Whether this member os part of this circle or not
   */
  isCircleMember(circleId: string, memberId: string): boolean {
    return this.circlesData[circleId].members.some(member => member.id === memberId);
  }

  onMemberDragging(event: DragEvent): void {
    const element = this.dragPreviewTemplateRef.nativeElement;
    element.style.left = `${event.pageX + 10}px`;
    element.style.top = `${event.pageY + 10}px`;
  }

  /**
   * On member hover highlight circles that contains that member.
   *
   * @param memberId Member ID.
   */
  onMemberHover(memberId: string): void {
    this.circles.forEach((circle: CircleMin): void => {
      if (this.circlesData[circle.id].members.some((member: Subscriber): boolean => member.id === memberId)) {
        this.circlesWithMember.push(circle.id);
      }
    });
  }

  /**
   * Handle member multi selection.
   *
   * @param event MouseEvent which is required to multi select.
   * @param member Member to add to {@link SelectionModel selection}.
   * @param memberList Member list to iterate through.
   * @param index Member index.
   */
  handleMemberClick(event: MouseEvent, member: Subscriber, memberList: Subscriber[], index: number): void {
    console.log('AAA');
    if (event.shiftKey) {
      /**
       * Store if member is selected, because we will clear the selection.
       */
      const isSelected: boolean = this.selection.isSelected(member);
      /**
       * Toggle selection.
       */
      if (isSelected) {
        this.selection.deselect(member);
      } else {
        this.selection.select(member);
      }
      if (!this.lastSelection) {
        this.lastSelection = member;
      }
      const start: number = index;
      const end: number = memberList
        .findIndex((alsoMember: Subscriber): boolean => this.lastSelection.id === alsoMember.id);

      memberList
        .slice(Math.min(start, end), Math.max(start, end) + 1)
        .forEach((current: Subscriber): void => {
          if (this.selection.isSelected(member)) {
            this.selection.select(current);
          } else {
            this.selection.deselect(current);
          }
        });

      this.lastSelection = member;
      return;
    } else {
      /**
       * Store if member is selected, because we will clear the selection.
       */
      const isSelected: boolean = this.selection.isSelected(member);
      /**
       * Check to see if user is holding the CTRL key or not. If not holding, then clear the selection and if member was
       * {@link selected} previously, then added to selection.
       */
      if (!event.ctrlKey) {
        this.selection.clear();
        this.lastSelection = member;
        if (isSelected) {
          this.selection.select(member);
          return;
        }
      }
      /**
       * Toggle selection.
       */
      if (isSelected) {
        this.selection.deselect(member);
      } else {
        this.selection.select(member);
      }
      this.lastSelection = member;
    }
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
        hovered: false,
        inDetail: false,
        added: {
          count: 0,
          showInfo: false,
        },
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
    this.loading = true;
    this.circleService.delete(circle.id).subscribe((): void => {
      this.loading = false;
      this.formSearch.get('search').setValue('');
      if (!this.selectedCircle.circle) {
        this.loadAvailableCircleMembers();
      }
      this.circles.splice(this.circles.indexOf(circle), 1);
      /**
       * Remove selected circle
       */
      if (this.selectedCircle.circle && circle.id === this.selectedCircle.circle.id) {
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
    this.selection.clear();
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
    this.searching = true;
    this.circleService.getMembers(this.selectedCircle.circle.id, {
      search,
    }).subscribe((members: ApiResponse<Subscriber>): void => {
      this.selectedCircle.members = members;
      this.searching = false;
    }, (): void => {
      this.searching = false;
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

  /**
   * Clear {@link selection} if user clicks on empty space.
   *
   * @param event MouseEvent required to get element that has been clicked on.
   */
  onUsersContainerClick(event: MouseEvent): void {
    const target: HTMLElement = (event.target as HTMLElement);
    if (target.classList.contains('row') || target.classList.contains('users-container')) {
      this.selection.clear();
    }
  }

  /**
   * Show dialog to create a new circle.
   *
   * @param members Members to add.
   */
  showCircleCreateDialog(members: Subscriber[] = []): void {
    const dialogRef: MatDialogRef<CircleCreateDialogComponent, void> = this.dialog.open(CircleCreateDialogComponent, {
      width: '560px',
      data: {
        selected: members,
      },
    });
    /**
     * Handle circle creation.
     */
    dialogRef.componentInstance.onCircleCreate.subscribe((data: CircleCreated): void => {
      this.circles.push(data.circle);
      this.circlesData[data.circle.id] = {
        membersCount: 0,
        members: [],
        hovered: false,
        inDetail: false,
        added: {
          count: 0,
          showInfo: false,
        },
      };
      this.circlesData[data.circle.id].hovered = true;
      /**
       * List of observables which their type is {@link BehaviorSubject} that hold boolean as value.
       */
      const observableList: BehaviorSubject<boolean>[] = [];
      if (data.members.length) {
        data.members.forEach((member: Subscriber): void => {
          /**
           * Create a [behavior subject]{@link BehaviorSubject} with `false` as its default value.
           */
          const statusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
          observableList.push(statusSubject);
          this.addMember(data.circle.id, member, statusSubject);
        });
      }
      /**
       * Wait for all observables to be done and show number of members that successfully has been added to the circle.
       */
      forkJoin(observableList).subscribe((observables: boolean[]): void => {
        this.circlesData[data.circle.id].added = {
          count: observables.length,
          showInfo: true,
        };
      });
    });
  }

  /**
   * Show dialog to edit a circle.
   *
   * @param circle Circle to edit.
   */
  showCircleEditDialog(circle: CircleMin): void {
    const dialogRef: MatDialogRef<CircleEditDialogComponent, CircleMin> = this.dialog.open(CircleEditDialogComponent, {
      data: circle,
    });
    /**
     * Update given circle in the list with latest data.
     */
    dialogRef.afterClosed().subscribe((data: CircleMin): void => {
      if (!data) {
        return;
      }
      // Find circle in the list and update its properties.
      const foundCircle: CircleMin = this.circles.find((circleMin: CircleMin): boolean => circleMin.id === data.id);
      if (foundCircle) {
        circle.name = data.name;
      }
    });
  }

  /**
   * Show a confirmation dialog before deleting a circle.
   *
   * @param circle Circle to delete.
   */
  showDeleteCircleDialog(circle: CircleMin): void {
    const dialogRef: MatDialogRef<ConfirmationDialogComponent, boolean> = this.dialog
      .open(ConfirmationDialogComponent, {
        data: {
          title: 'CIRCLE_DELETE_DIALOG_TITLE',
          content: 'CIRCLE_DELETE_DIALOG_CONTENT',
        },
      });
    /**
     * Handle circle deletion after returned results from the confirmation dialog.
     */
    dialogRef.afterClosed().subscribe((data: boolean): void => {
      if (data && data === true) {
        this.delete(circle);
      }
    });
  }

  /**
   * Clear search input and refocus on the input.
   *
   * @param abstractControl Abstract control to clear its value.
   * @param input Input HTML element to clear text and refocus on it.
   */
  clearSearch(abstractControl: AbstractControl, input: HTMLInputElement): void {
    input.value = '';
    abstractControl.setValue('');
    input.focus();
  }

  /**
   * Remove selected members and clear selection.
   */
  removeSelectedMembers(): void {
    this.selection.selected.forEach((member: Subscriber): void => {
      this.removeMember(member.id);
    });
    this.selection.clear();
  }
}
