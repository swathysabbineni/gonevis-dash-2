import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { MediaService } from '@app/components/dash/media/media.service';
import { File as FileMedia } from '@app/interfaces/file';
import { UploadUrlResponse } from '@app/interfaces/v1/upload-url-response';
import { environment } from '@environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {

  /**
   * Upload event (when file upload is finished)
   */
  @Output() upload: EventEmitter<FileMedia> = new EventEmitter<FileMedia>();

  /**
   * File upload accept list
   */
  readonly accept = MediaService.acceptList.join(',');

  /**
   * File input reference
   */
  @ViewChild('fileElement', { static: false }) fileElement;

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
    this.toast.success(this.translate.instant('TOAST_UPLOAD'), file.file_name);
    this.upload.emit(file);
  }

  /**
   * When user tries to upload a file
   */
  onFileSelected(): void {
    const files: File[] = this.fileElement.nativeElement.files;
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
