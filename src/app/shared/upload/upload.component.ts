import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { MediaService } from '@app/components/dash/media/media.service';
import { File as FileMedia } from '@app/interfaces/file';
import { UploadUrlResponse } from '@app/interfaces/v1/upload-url-response';

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

  constructor(private mediaService: MediaService) {
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
        ).subscribe((): void => {
          this.mediaService.post(
            response.post_data.fields.key,
          ).subscribe((fileUploaded: FileMedia): void => {
            this.upload.emit(fileUploaded);
          });
        });
      });
    }
  }
}
