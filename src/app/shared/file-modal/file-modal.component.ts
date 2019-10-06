import { trigger, style, state, transition, animate } from '@angular/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaService } from '@app/components/dash/media/media.service';
import { ApiError } from '@app/interfaces/api-error';
import { File } from '@app/interfaces/file';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload';
import { faImages } from '@fortawesome/free-solid-svg-icons/faImages';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons/faShareAlt';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { TranslateService } from '@ngx-translate/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-file-modal',
  templateUrl: './file-modal.component.html',
  styleUrls: ['./file-modal.component.scss'],
  animations: [
    trigger('flyInFlyOut', [
      state('void', style({ marginTop: '-60px' })),
      transition('void => *', [animate('100ms linear')]),
      transition('* => void', [animate('100ms linear')]),
    ]),
  ],
})
export class FileModalComponent {

  readonly back: IconDefinition = faArrowLeft;
  readonly trash: IconDefinition = faTrash;
  readonly download: IconDefinition = faDownload;
  readonly share: IconDefinition = faShareAlt;
  readonly edit: IconDefinition = faPen;
  readonly images: IconDefinition = faImages;

  /**
   * Image element
   */
  @ViewChild('image', { static: false }) image: ElementRef;

  /**
   * Media file data
   */
  file: File;

  /**
   * Show image in full mode (no header)
   */
  full: boolean;

  /**
   * Image dimensions
   */
  dimensions: { width: number, height: number };

  /**
   * Edit form
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

  /**
   * Edit popover visibility
   */
  showEdit: boolean;

  constructor(public modal: BsModalRef,
              private translate: TranslateService,
              private mediaService: MediaService,
              private toast: ToastrService,
              private formBuilder: FormBuilder) {
  }


  /**
   * Delete the file
   */
  delete(): void {
    if (!confirm(this.translate.instant('CONFORM_DELETE_FILE'))) {
      return;
    }
    this.file.deleted = true;
    this.modal.hide();
    this.mediaService.delete(this.file.id).subscribe((): void => {
      this.toast.info(this.translate.instant('TOAST_DELETE'), this.file.meta_data.name);
    });
  }

  /**
   * On image load
   */
  load() {
    this.dimensions = {
      width: (this.image.nativeElement as HTMLImageElement).width,
      height: (this.image.nativeElement as HTMLImageElement).height,
    };
  }

  /**
   * Show and setup edit form
   */
  setupEdit(): void {
    if (this.showEdit) {
      this.showEdit = false;
    } else {
      this.form = this.formBuilder.group({
        name: [this.file.meta_data.name, Validators.required],
        description: [this.file.meta_data.description],
      });
      this.showEdit = true;
      this.loading = false;
      this.error = {};
    }
  }

  /**
   * Submit edit form
   */
  submit(): void {
    this.loading = true;
    this.mediaService.update(this.file.id, this.form.value).subscribe((data: File): void => {
      this.file = data;
      this.loading = false;
      this.error = {};
      this.toast.info(this.translate.instant('TOAST_UPDATE'), this.file.meta_data.name);
      this.showEdit = false;
    }, (error: HttpErrorResponse): void => {
      this.loading = false;
      this.error = error.error;
    });
  }
}
