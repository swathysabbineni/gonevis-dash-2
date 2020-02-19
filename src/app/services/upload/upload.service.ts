import { HttpClient, HttpEventType, HttpResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MediaService } from '@app/components/dash/media/media.service';
import { File as FileMedia } from '@app/interfaces/file';
import { UploadProgress } from '@app/interfaces/upload-progress';
import { UploadUrlResponse } from '@app/interfaces/v1/upload-url-response';
import { environment } from '@environments/environment';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadService {

  constructor(private http: HttpClient,
              private mediaService: MediaService) {
  }

  upload(files: File[]): { [p: string]: { progress: Observable<UploadProgress> } } {
    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<UploadProgress> } } = {};

    for (const file of files) {
      /**
       * create a new multipart-form for every file
       */
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      /**
       * Setup a subject for every file
       */
      const progress: Subject<UploadProgress> = new Subject<UploadProgress>();
      setTimeout(() => {
        progress.next({ progress: 0, data: null });
      });
      this.mediaService.uploadUrl({
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      }).subscribe((response: UploadUrlResponse): void => {
        this.mediaService.uploadToUrl(
          response.post_data.url,
          file,
          response.post_data.fields,
        ).subscribe((event: HttpEvent<FileMedia>): void => {
          if (event.type === HttpEventType.UploadProgress) {
            /**
             * Calculate the progress percentage and update progress subject
             */
            progress.next({ progress: Math.round((100 * event.loaded) / event.total), data: null });
          } else if (event instanceof HttpResponse) {
            if (environment.name === 'local') {
              // this.onFileUpload(event.body);
              progress.next({ progress: 100, data: event.body });
              /**
               * Mark progress as complete
               */
              progress.complete();
            } else {
              this.mediaService.post(
                response.post_data.fields.key,
              ).subscribe((fileUploaded: FileMedia): void => {
                progress.next({ progress: 100, data: fileUploaded });
                /**
                 * Mark progress as complete
                 */
                progress.complete();
              });
            }
          }
        });
      });
      /**
       * Save every progress-observable in a map of all observables
       */
      status[file.name] = {
        progress: progress.asObservable(),
      };
    }
    /**
     * return the map of progress.observables
     */
    return status;
  }
}
