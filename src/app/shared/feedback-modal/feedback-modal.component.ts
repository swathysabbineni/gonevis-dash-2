import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiError } from '@app/interfaces/api-error';
import { FeedbackService } from '@app/services/feedback/feedback.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faAngry } from '@fortawesome/free-regular-svg-icons/faAngry';
import { faFrown } from '@fortawesome/free-regular-svg-icons/faFrown';
import { faGrinHearts } from '@fortawesome/free-regular-svg-icons/faGrinHearts';
import { faMeh } from '@fortawesome/free-regular-svg-icons/faMeh';
import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile';
import { faBug } from '@fortawesome/free-solid-svg-icons/faBug';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons/faLightbulb';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss'],
})
export class FeedbackModalComponent implements OnInit {

  readonly times: IconDefinition = faTimes;

  /**
   * Available subject options
   */
  readonly subjects: { label: string, value: string, icon: IconDefinition, color: string }[] = [
    { label: 'SUGGESTION', value: 'Suggestion', icon: faLightbulb, color: 'primary' },
    { label: 'BUG_REPORT', value: 'Bug Report', icon: faBug, color: 'danger' },
    { label: 'FEATURE_REQUEST', value: 'Feature Request', icon: faCheckCircle, color: 'success' },
  ];

  /**
   * Available experience options
   */
  readonly experiences: { label: string, value: string, icon: IconDefinition, color: string }[] = [
    { label: 'ANGRY', value: 'Angry', icon: faAngry, color: 'danger' },
    { label: 'UNHAPPY', value: 'Unhappy', icon: faFrown, color: 'warning' },
    { label: 'NATURAL', value: 'Natural', icon: faMeh, color: 'secondary' },
    { label: 'HAPPY', value: 'Happy', icon: faSmile, color: 'primary' },
    { label: 'IN_LOVE', value: 'In Love', icon: faGrinHearts, color: 'success' },
  ];

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
      subject: [''],
      experience: [''],
      message: ['', Validators.required],
    });
  }

  /**
   * Submit feedback
   */
  submit(): void {
    this.loading = true;
    const data = this.form.value;
    this.feedbackService.send(
      `Subject: ${data.subject}\nExperience: ${data.experience}\n\n${data.message}`,
    ).subscribe((): void => {
      this.modal.hide();
    }, error => {
      this.error = error.error;
      this.loading = false;
    });
  }
}
