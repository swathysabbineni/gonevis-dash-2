import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { FeedbackService } from '@app/services/feedback/feedback.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
})
export class FeedbackModalComponent implements OnInit {

  readonly times: IconDefinition = faTimes;

  /**
   * Feedback form
   */
  form: FormGroup;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * API errors
   */
  error: ApiError = {};

  constructor(public modal: BsModalRef,
              private formBuilder: FormBuilder,
              private feedbackService: FeedbackService) {
  }

  ngOnInit(): void {
    /**
     * Setup feedback form
     */
    this.form = this.formBuilder.group({
      message: ['', Validators.required],
    });
  }

  /**
   * Submit feedback
   */
  submit(): void {
    this.loading = true;
    this.feedbackService.send(this.form.get('message').value).subscribe((): void => {
      this.modal.hide();
    }, error => {
      this.error = error.error;
      this.loading = false;
    });
  }
}
