import { KeyValue } from '@angular/common';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, ViewChild, Output, EventEmitter, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaService } from '@app/components/dash/media/media.service';
import { File as FileMedia } from '@app/interfaces/file';
import { UploadUrlResponse } from '@app/interfaces/v1/upload-url-response';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { UploadService } from '@app/services/upload/upload.service';
import { UploadingFile } from '@app/shared/upload/uploading-file';
import { environment } from '@environments/environment';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons/faFileUpload';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnDestroy {

  /**
   * Represents a disposable resource, such as the execution of an Observable. A
   * Subscription has one important method, `unsubscribe`, that takes no argument
   * and just disposes the resource held by the subscription
   */
  private readonly subscription: Subscription = new Subscription();

  /**
   * File upload icon
   */
  readonly faFileUpload: IconDefinition = faFileUpload;

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
  @ViewChild('fileElement', { static: false }) fileElement;

  /**
   * Selected files whether via drag and drop or via file manager selection
   */
  selectedFiles: Map<string, UploadingFile> = new Map<string, UploadingFile>([]);

  constructor(private mediaService: MediaService,
              private translate: TranslateService,
              private toast: ToastrService,
              private uploadService: UploadService,
              private cd: ChangeDetectorRef) {
  }

  /**
   * File upload completed
   *
   * @param file Uploaded file
   */
  private onFileUpload(file: FileMedia): void {
    this.toast.success(this.translate.instant('TOAST_UPLOAD'), file.meta_data.name);
    this.upload.emit(file);
    this.cd.detectChanges();
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
    /**
     * List of observables which their type is {@link BehaviorSubject} that hold boolean as value
     */
    const observableList: BehaviorSubject<boolean>[] = [];
    /**
     * Iterate through given files
     */
    for (const file of files) {
      /**
       * Create a [behavior subject]{@link BehaviorSubject} with `false` as its default value
       */
      const statusSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
      observableList.push(statusSubject);
      /**
       * Create and push uploaded file
       */
      this.selectedFiles.set(file.name, new UploadingFile(file));
      /**
       * create a new multipart-form for every file
       */
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      /**
       * Upload to get file URL
       */
      this.mediaService.uploadUrl({
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      }).subscribe((response: UploadUrlResponse): void => {
        /**
         * Mark file as in progress
         */
        // this.uploadingList[file.name].preparing = false;
        this.selectedFiles.get(file.name).preparing = false;
        this.cd.detectChanges();
        /**
         * API call
         */
        this.mediaService.uploadToUrl(
          response.post_data.url,
          file,
          response.post_data.fields,
        ).subscribe((event: HttpEvent<FileMedia>): void => {
          /**
           * If file is in progress of uploading then update its percentage,
           * otherwise it means uploading to URL is completed.
           */
          if (event.type === HttpEventType.UploadProgress) {
            /**
             * Calculate the progress percentage and update progress subject
             */
            this.selectedFiles.get(file.name).progress = Math.round((100 * event.loaded) / event.total);
            this.cd.detectChanges();
          } else if (event instanceof HttpResponse) {
            /**
             * If environment is local, then get response data from event and mark progress as complete,
             * otherwise post file to backend and wait for response data.
             */
            if (environment.name === 'local') {
              this.selectedFiles.get(file.name).updateProperty({
                data: event.body,
                done: true,
                color: 'success',
              });
              this.onFileUpload(event.body);
              statusSubject.next(true);
              statusSubject.complete();
              this.cd.detectChanges();
            } else {
              /**
               * API call
               */
              this.mediaService.post(response.post_data.fields.key).subscribe((fileUploaded: FileMedia): void => {
                this.selectedFiles.get(file.name).updateProperty({
                  data: fileUploaded,
                  done: true,
                  color: 'success',
                });
                this.onFileUpload(fileUploaded);
                statusSubject.next(true);
                statusSubject.complete();
                this.cd.detectChanges();
              }, (error: HttpErrorResponseApi): void => { /* Post error handler */
                this.selectedFiles.get(file.name).updateProperty({
                  error: error.error,
                  color: 'danger',
                });
                statusSubject.complete();
                this.cd.detectChanges();
              });
            }
          }
        }, (error: HttpErrorResponseApi): void => { /* Upload to URL error handler */
          this.selectedFiles.get(file.name).updateProperty({
            error: error.error,
            color: 'danger',
          });
          statusSubject.complete();
          this.cd.detectChanges();
        });
      }, (error: HttpErrorResponseApi): void => { /* Upload URL error handler */
        this.selectedFiles.get(file.name).updateProperty({
          error: error.error,
          color: 'danger',
        });
        statusSubject.complete();
        this.cd.detectChanges();
      });
    }
    forkJoin(observableList).subscribe((data: boolean[]): void => {
      console.log(data);
    });
  }

  ngOnDestroy(): void {
    /**
     * Disposes the resources held by the subscription
     */
    this.subscription.unsubscribe();
  }

  /**
   * @description
   *
   * Keep original order
   *
   * @param a Key-value object
   * @param b Kay-value object
   *
   * @returns Zero to keep original order
   */
  originalOrder(a: KeyValue<string, UploadingFile>, b: KeyValue<string, UploadingFile>): number {
    return 0;
  }
}
