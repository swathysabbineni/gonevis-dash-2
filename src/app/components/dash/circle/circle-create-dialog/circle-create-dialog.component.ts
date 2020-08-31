import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Inject } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CircleService } from '@app/components/dash/circle/circle.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { CircleCreated } from '@app/interfaces/circle-created';
import { Circle } from '@app/interfaces/v1/circle';
import { Subscriber } from '@app/interfaces/v1/subscriber';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { debounceTime } from 'rxjs/operators';
import { ReactiveFormData } from 'src/app/interfaces/reactive-form-data';

@Component({
  selector: 'app-circle-create-dialog',
  templateUrl: './circle-create-dialog.component.html',
})
export class CircleCreateDialogComponent implements OnInit {

  readonly faTimes: IconDefinition = faTimes;
  readonly faTimesCircle: IconDefinition = faTimesCircle;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  /** Get element reference responsible for holding follower search input. */
  @ViewChild('followerInput') followerInput: ElementRef<HTMLInputElement>;

  /**
   * Emit {@link CircleCreated} synchronously or asynchronously, and register handlers it
   * by subscribing to an instance.
   *
   * This emitter gets triggered once circle is created.
   */
  onCircleCreate: EventEmitter<CircleCreated> = new EventEmitter<CircleCreated>();

  /** Selected members. */
  @Input() members: Subscriber[];

  /** Search form. */
  queryControl: FormControl;

  /** Circle creation form. */
  form: ReactiveFormData = {
    error: {},
  };

  /** Stores selected followers which will be used to add them to the circle after it's created. */
  selectedFollowers: Subscriber[] = [];

  /** List of blog's followers. */
  followers: Subscriber[];

  constructor(public dialogRef: MatDialogRef<CircleCreateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { selected: Subscriber[], },
              private formBuilder: FormBuilder,
              private circleService: CircleService) {
  }

  ngOnInit(): void {
    // Update selected followers if dialog was given list of followers.
    this.selectedFollowers = this.data.selected;
    // Setup circle creation form.
    this.form.form = this.formBuilder.group({
      name: ['', Validators.required],
    });
    // Setup query control for searching followers.
    this.queryControl = new FormControl('');
    /**
     * Get followers once {@link queryControl}'s value changed. (which is being used for autocomplete)
     */
    this.queryControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value: string): void => {
        // Value will be null when the user has selected an auto tag.
        // So we don't retrieve tags again until user writes something.
        if (value === null) {
          return;
        }
        this.getFollowers(value);
      });
    this.getFollowers();
  }

  /**
   * Load available members.
   *
   * @param search Search text.
   */
  getFollowers(search: string = ''): void {
    this.circleService.getAvailableMembers(search).subscribe((data: ApiResponse<Subscriber>): void => {
      const selectedIds: string[] = this.selectedFollowers.map((follower: Subscriber): string => follower.id);
      this.followers = data.results.filter((follower: Subscriber): boolean => !selectedIds.includes(follower.id));
    });
  }

  /**
   * Remove follower from {@link selectedFollowers selected followers}.
   *
   * @param followerId Follower Id.
   */
  remove(followerId: string): void {
    this.selectedFollowers = this.selectedFollowers
      .filter((follower: Subscriber): boolean => follower.id !== followerId);
  }

  /**
   * Select follower.
   *
   * @param follower Follower to add to {@link selectedFollowers selected followers}.
   */
  selected(follower: Subscriber): void {
    this.selectedFollowers.push(follower);
    this.followerInput.nativeElement.value = '';
    // Clear search input so user can search another follower.
    this.queryControl.setValue(null);
    this.followers = [];
  }


  /** Create circle with selected members. */
  createCircle(): void {
    // Prevent creation if form is invalid.
    // In other words if user didn't provide any name, prevent creation.
    if (this.form.form.invalid) {
      return;
    }
    this.form.loading = true;
    this.circleService.create(this.form.form.value).subscribe((data: Circle): void => {
      // Emit created circle with selected members.
      this.onCircleCreate.emit({ circle: data, members: this.selectedFollowers });
      // Close the dialog after creating the circle.
      this.dialogRef.close();
      this.form.loading = false;
    }, (error: HttpErrorResponseApi): void => {
      this.form.error = error.error;
      // If error is related to name field then mark form as invalid and show the error.
      if (this.form.error.name) {
        this.form.form.get('name').setErrors({ invalid: true });
        this.form.form.markAllAsTouched();
      }
      this.form.loading = false;
    });
  }
}
