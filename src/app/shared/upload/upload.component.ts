import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MediaService } from '@app/components/dash/media/media.service';
import { File as FileMedia } from '@app/interfaces/file';
import { UploadUrlResponse } from '@app/interfaces/v1/upload-url-response';
import { environment } from '@environments/environment';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons/faFileUpload';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {

  /**
   * File upload icon
   */
  faFileUpload: IconDefinition = faFileUpload;

  /**
   * Upload event (when file upload is finished)
   */
  @Output() upload: EventEmitter<FileMedia> = new EventEmitter<FileMedia>();

  /**
   * Determines whether or not drag and drop should be triggered full screen instead of a certain position
   */
  @Input() dropZone: boolean;

  /**
   * File upload accept list
   */
  readonly accept = MediaService.acceptList.join(',');

  /**
   * File input reference
   */
  @ViewChild('fileElement') fileElement;

  constructor(private mediaService: MediaService,
              private translate: TranslateService,
              private toast: ToastrService) {
  }

  /**
   * FIle upload completed
   *
   * @param file Uploaded file
   */
  private onFileUpload(file: FileMedia) {
    this.toast.success(this.translate.instant('TOAST_UPLOAD'), file.meta_data.name);
    this.upload.emit(file);
  }

  /**
   * When user tries to upload a file
   *
   * @param droppedFiles Dropped files
   */
  onFileSelected(droppedFiles?: File[]): void {
    let files: File[] = [];
    /**
     * If method was called from drop event, then get dropped files,
     * otherwise get selected files from input.
     */
    if (droppedFiles) {
      files = droppedFiles;
    } else {
      files = this.fileElement.nativeElement.files;
    }
    if (!files[0]) {
      return;
    }
    for (const file of files) {
      this.mediaService.uploadUrl({
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      }).subscribe((response: UploadUrlResponse): void => {
        this.mediaService.uploadToUrl(
          response.post_data.url,
          file,
          response.post_data.fields,
        ).subscribe((data: void | FileMedia): void => {
          if (environment.name === 'local') {
            this.onFileUpload(data as FileMedia);
          } else {
            this.mediaService.post(
              response.post_data.fields.key,
            ).subscribe((fileUploaded: FileMedia): void => {
              this.onFileUpload(fileUploaded);
            });
          }
        });
      });
    }
  }
}
