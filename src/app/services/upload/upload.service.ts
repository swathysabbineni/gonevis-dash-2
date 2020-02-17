import {
  HttpClient,
  HttpRequest,
  HttpEventType,
  HttpResponse,
  HttpProgressEvent,
  HttpEvent,
} from '@angular/common/http';
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

  public upload(files: Set<File>) {
    // this will be the our resulting map
    const status: { [key: string]: { progress: Observable<UploadProgress> } } = {};

    files.forEach((file: File): void => {
      /**
       * create a new multipart-form for every file
       */
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      /**
       * Setup a subject for every file
       */
      const progress = new Subject<UploadProgress>();

      // this.mediaService.uploadUrl({
      //   file_name: file.name,
      //   file_size: file.size,
      //   mime_type: file.type,
      // }).subscribe((response: UploadUrlResponse): void => {
      //   this.mediaService.uploadToUrl(
      //     response.post_data.url,
      //     file,
      //     response.post_data.fields,
      //   ).subscribe((event: HttpEvent<void | FileMedia>): void => {
      //     if (event.type === HttpEventType.UploadProgress) {
      //       /**
      //        * Calculate the progress percentage and update progress subject
      //        */
      //       progress.next(Math.round((100 * event.loaded) / event.total));
      //     } else if (event instanceof HttpResponse) {
      //       if (environment.name === 'local') {
      //         this.onFileUpload(data as FileMedia);
      //       } else {
      //         this.mediaService.post(
      //           response.post_data.fields.key,
      //         ).subscribe((fileUploaded: FileMedia): void => {
      //           this.onFileUpload(fileUploaded);
      //         });
      //       }
      //       progress.next({ progress: 100, data: event.body });
      //       /**
      //        * Mark progress as complete
      //        */
      //       progress.complete();
      //     }
      //   });
      // });

      /**
       * Create an HTTP POST request and pass the form with option to report progress
       */
      // const req = new HttpRequest('POST', url, formData, {
      //   reportProgress: true,
      // });
      // /**
      //  * Setup a subject for every file
      //  */
      // const progress = new Subject<number>();
      //
      // const startTime = new Date().getTime();
      // this.http.request(req).subscribe((event: HttpProgressEvent): void => {
      //   if (event.type === HttpEventType.UploadProgress) {
      //     /**
      //      * Calculate the progress percentage and update progress subject
      //      */
      //     progress.next(Math.round((100 * event.loaded) / event.total));
      //   } else if (event instanceof HttpResponse) {
      //     /**
      //      * Mark progress as complete
      //      */
      //     progress.complete();
      //   }
      // });
      /**
       * Save every progress-observable in a map of all observables
       */
      status[file.name] = {
        progress: progress.asObservable(),
      };
    });
    /**
     * return the map of progress.observables
     */
    return status;
  }
}
