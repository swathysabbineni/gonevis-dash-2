import { Component, ViewChild, Output, EventEmitter, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaService } from '@app/components/dash/media/media.service';
import { File as FileMedia } from '@app/interfaces/file';
import { UploadProgress } from '@app/interfaces/upload-progress';
import { UploadService } from '@app/services/upload/upload.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons/faFileUpload';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, Subscription } from 'rxjs';

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

  progress: { [p: string]: { progress: Observable<UploadProgress> } };

  files: File[] = [];

  inProgressFiles: { [p: string]: UploadProgress } = {};

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
    this.files = files;
    // start the upload and save the progress map
    this.progress = this.uploadService.upload(files);
    this.cd.detectChanges();
    Object.keys(this.progress).forEach((key: string): void => {
      this.subscription.add(
        this.progress[key].progress.subscribe((value: UploadProgress): void => {
          this.inProgressFiles[key] = value;
          this.cd.detectChanges();
        }),
      );
    });

    // convert the progress map into an array
    const allProgressObservables: Observable<UploadProgress>[] = Object.keys(this.progress)
      .map((key: string): Observable<UploadProgress> => this.progress[key].progress);

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe((data: UploadProgress[]): void => {
      data
        .filter((uploadProgress: UploadProgress): boolean => !!uploadProgress.data)
        .forEach((uploadProgress: UploadProgress): void => {
            /**
             * Disposes the resources held by the subscription
             */
            this.subscription.unsubscribe();
            this.onFileUpload(uploadProgress.data);
          },
        );
    });
  }

  ngOnDestroy(): void {
    /**
     * Disposes the resources held by the subscription
     */
    this.subscription.unsubscribe();
  }
}
