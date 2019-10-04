import { trigger, style, state, transition, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { MediaService } from '@app/components/dash/media/media.service';
import { File } from '@app/interfaces/file';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
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

  readonly trash: IconDefinition = faTrash;
  readonly times: IconDefinition = faTimes;

  /**
   * Media file data
   */
  file: File;

  /**
   * Show image in full mode (no header)
   */
  full: boolean;

  constructor(public modal: BsModalRef,
              private translate: TranslateService,
              private mediaService: MediaService,
              private toast: ToastrService) {
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
      this.toast.info(this.translate.instant('TOAST_DELETE'), this.file.file_name);
    });
  }
}
