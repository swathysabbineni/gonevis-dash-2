import { KeyValue } from '@angular/common';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  OnDestroy,
  ElementRef,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MediaService } from '@app/components/dash/media/media.service';
import { BlogPlanName } from '@app/enums/blog-plan-name';
import { File as FileMedia } from '@app/interfaces/file';
import { UploadUrlResponse } from '@app/interfaces/v1/upload-url-response';
import { HttpErrorResponseApi } from '@app/models/http-error-response-api';
import { BlogService } from '@app/services/blog/blog.service';
import { Plan } from '@app/shared/locked-feature/shared/enums/plan';
import { UploadingFile } from '@app/shared/upload/uploading-file';
import { environment } from '@environments/environment';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faFileAlt } from '@fortawesome/free-regular-svg-icons/faFileAlt';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons/faTimesCircle';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons/faCloudUploadAlt';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ActiveToast } from 'ngx-toastr/toastr/toastr.service';
import { forkJoin, Subscription, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {

  /**
   * Represents a disposable resource, such as the execution of an Observable. A
   * Subscription has one important method, `unsubscribe`, that takes no argument
   * and just disposes the resource held by the subscription
   */
  private readonly subscription: Subscription = new Subscription();


  readonly plan = Plan;

  readonly faUpload: IconDefinition = faCloudUploadAlt;
  readonly faFile: IconDefinition = faFileAlt;
  readonly faRemove: IconDefinition = faTimesCircle;
  readonly faUploading: IconDefinition = faCircleNotch;

  /**
   * Upload event (when file upload is finished)
   */
  @Output() upload: EventEmitter<FileMedia> = new EventEmitter<FileMedia>();

  /**
   * On navigate event is being used to close file selection modal once user clicks on optimized toaster.
   */
  @Output() navigated: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Determines whether or not drag and drop should be triggered full screen instead of a certain position
   */
  @Input() globalDrop: boolean;

  /**
   * File upload accept list
   */
  readonly accept: string = MediaService.acceptList.join(',');

  /**
   * File input reference
   */
  @ViewChild('fileElement') fileElement: ElementRef;

  /**
   * Selected files whether via drag and drop or via file manager selection
   */
  selectedFiles: Map<string, UploadingFile> = new Map<string, UploadingFile>([]);

  /**
   * Boolean which indicates whether or not dragging started
   */
  dragStarted: boolean;

  /**
   * File optimization control which is being used to toggle file optimization.
   */
  fileOptimizeControl: FormControl = new FormControl(false);

  /**
   * Optimization active toast which is being used to listen to clicks (which will redirect user to upgrade page),
   * and being used to remove duplicated toasts.
   */
  fileOptimizeToast: ActiveToast<any>;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private mediaService: MediaService,
              private translate: TranslateService,
              private changeDetectorRef: ChangeDetectorRef,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.fileOptimizeControl.valueChanges.subscribe((value: boolean): void => {
      // Check if current blog's plan is Professional.
      if (value === true && BlogService.currentBlog.plan_name !== BlogPlanName.PROFESSIONAL) {
        // Remove and destroy file optimization toast if it's being shown already.
        if (this.fileOptimizeToast) {
          this.toastrService.remove(this.fileOptimizeToast.toastId);
        }
        // Uncheck optimization option.
        this.fileOptimizeControl.setValue(false);
        this.translate.get(['FILE_OPTIMIZATION_PLAN_ERROR', 'IMAGE_OPTIMIZATION_FEATURE'])
          .subscribe((response: any): void => {
            // Show a toaster which takes user to upgrade page once clicked on it.
            this.fileOptimizeToast = this.toastrService.success(
              response.FILE_OPTIMIZATION_PLAN_ERROR,
              response.IMAGE_OPTIMIZATION_FEATURE,
            );
            this.fileOptimizeToast.onTap.subscribe((): void => {
              // Redirect to upgrade page.
              this.router.navigate(['dash', BlogService.currentBlogIndex, 'settings', 'upgrade']);
              // Notify file selection modal to close itself.
              this.navigated.emit();
            });
          });
      }
    });
  }

  /**
   * File upload completed
   *
   * @param file Uploaded file
   */
  private onFileUpload(file: FileMedia): void {
    this.upload.emit(file);
    this.changeDetectorRef.detectChanges();
  }

  /**
   * When user tries to upload a file
   *
   * @param droppedFiles Dropped files
   */
  onFileSelected(droppedFiles?: File[]): void {
    const isOptimized: boolean = this.fileOptimizeControl.value;
    let files: File[] = [];
    /**
     * If method was called from drop event, then get dropped files,
     * otherwise get selected files from input.
     */
    if (droppedFiles) {
      files = droppedFiles;
    } else {
      files = Object.assign([], this.fileElement.nativeElement.files);
    }
    if (!files[0]) {
      return;
    }
    /**
     * List of observables which their type is {@link BehaviorSubject} that hold boolean as value
     */
    const observableList: BehaviorSubject<boolean>[] = [];
    // Empty list of files so user can upload same file again.
    this.fileElement.nativeElement.value = '';
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
        is_optimized: isOptimized,
      }).subscribe((response: UploadUrlResponse): void => {
        /**
         * Mark file as in progress
         */
        // this.uploadingList[file.name].preparing = false;
        this.selectedFiles.get(file.name).preparing = false;
        this.changeDetectorRef.detectChanges();
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
            this.changeDetectorRef.detectChanges();
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
              this.changeDetectorRef.detectChanges();
            } else {
              /**
               * API call
               */
              this.mediaService.post(
                response.post_data.fields.key,
                isOptimized,
              ).subscribe((fileUploaded: FileMedia): void => {
                this.selectedFiles.get(file.name).updateProperty({
                  data: fileUploaded,
                  done: true,
                  color: 'success',
                });
                this.onFileUpload(fileUploaded);
                statusSubject.next(true);
                statusSubject.complete();
                this.changeDetectorRef.detectChanges();
              }, (error: HttpErrorResponseApi): void => { /* Post error handler */
                this.selectedFiles.get(file.name).updateProperty({
                  error: error.error,
                  color: 'danger',
                });
                statusSubject.complete();
                this.changeDetectorRef.detectChanges();
              });
            }
          }
        }, (error: HttpErrorResponseApi): void => { /* Upload to URL error handler */
          this.selectedFiles.get(file.name).updateProperty({
            error: error.error,
            color: 'danger',
          });
          statusSubject.complete();
          this.changeDetectorRef.detectChanges();
        });
      }, (error: HttpErrorResponseApi): void => { /* Upload URL error handler */
        this.selectedFiles.get(file.name).updateProperty({
          error: error.error,
          color: 'danger',
        });
        statusSubject.complete();
        this.changeDetectorRef.detectChanges();
      });
    }
    forkJoin(observableList).subscribe((data: boolean[]): void => {
      console.log('Uploading files is done', data);
    });
  }

  ngOnDestroy(): void {
    /**
     * Disposes the resources held by the subscription
     */
    this.subscription.unsubscribe();
    this.navigated.unsubscribe();
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
