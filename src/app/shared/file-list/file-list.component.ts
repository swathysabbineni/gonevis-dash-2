import { DatePipe, KeyValue } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MediaService } from '@app/components/dash/media/media.service';
import { FileExtension } from '@app/enums/file-extension';
import { Order } from '@app/enums/order';
import { ApiResponse } from '@app/interfaces/api-response';
import { File } from '@app/interfaces/file';
import { Filter } from '@app/interfaces/filter';
import { Pagination } from '@app/interfaces/pagination';
import { Sort } from '@app/interfaces/sort';
import { UtilService } from '@app/services/util/util.service';
import { FileModalComponent } from '@app/shared/file-modal/file-modal.component';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCalendar } from '@fortawesome/free-regular-svg-icons/faCalendar';
import { faHdd } from '@fortawesome/free-regular-svg-icons/faHdd';
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';
import { faFileArchive } from '@fortawesome/free-solid-svg-icons/faFileArchive';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons/faFileExcel';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFilePowerpoint } from '@fortawesome/free-solid-svg-icons/faFilePowerpoint';
import { faFileWord } from '@fortawesome/free-solid-svg-icons/faFileWord';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { faSort } from '@fortawesome/free-solid-svg-icons/faSort';
import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons/faSortAmountDown';
import { faSortAmountUp } from '@fortawesome/free-solid-svg-icons/faSortAmountUp';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  providers: [DatePipe],
})
export class FileListComponent implements OnInit {

  readonly faFilter: IconDefinition = faFilter;
  readonly faSort: IconDefinition = faSort;
  readonly faClear: IconDefinition = faTimes;
  readonly faAsc: IconDefinition = faSortAmountUp;
  readonly faDesc: IconDefinition = faSortAmountDown;

  readonly order = Order;

  /**
   * List of sorting fields
   */
  readonly sortFields: Sort[] = [{
    value: 'created',
    label: 'UPLOAD_DATE',
    icon: faCalendar,
  }, {
    value: 'size',
    label: 'Size',
    icon: faHdd,
  }];

  /**
   * List of sorting fields
   */
  readonly extensionFilters: Filter<FileExtension>[] = [{
    value: '',
    label: 'ALL_MEDIA',
  }, {
    value: FileExtension.Image,
    label: 'IMAGE',
  }, {
    value: FileExtension.Audio,
    label: 'AUDIO',
  }, {
    value: FileExtension.Video,
    label: 'VIDEO',
  }, {
    value: FileExtension.Document,
    label: 'DOCUMENT',
  }, {
    value: FileExtension.Archive,
    label: 'ARCHIVE',
  }];

  /**
   * Selection mode
   */
  @Input() selection = false;

  /**
   * Whether or not pagination should have margin
   */
  @Input() margin = true;

  /**
   * Show images only
   */
  @Input() imageOnly: boolean;

  /**
   * Selected file ID
   */
  @Input() selected: string;

  /**
   * File select event
   */
  @Output() choose: EventEmitter<File> = new EventEmitter<File>();

  /**
   * Current search text
   */
  search: string;

  /**
   * Current extension filter
   */
  extensionFilter: Filter<FileExtension> = this.extensionFilters[0];

  /**
   * List of blog media files
   */
  files: File[];

  /**
   * List of blog media files grouped by date
   */
  fileGroups: Map<string, File[]> = new Map<string, File[]>();

  /**
   * API pagination data
   */
  pagination: Pagination = {
    itemsPerPage: MediaService.PAGE_SIZE,
    totalItems: 0,
    currentPage: 1,
    id: 'file-list',
  };

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * Current sort field
   */
  sortField: Sort;

  /**
   * Sorting order (ascending or descending)
   */
  sortOrder: Order = Order.ASCENDING;

  constructor(public utils: UtilService,
              private changeDetectorRef: ChangeDetectorRef,
              private mediaService: MediaService,
              private translate: TranslateService,
              private toast: ToastrService,
              private modalService: BsModalService) {
  }

  ngOnInit(): void {
    /**
     * Show only images if {@link imageOnly} was given as `true`
     */
    if (this.imageOnly) {
      this.extensionFilter = this.extensionFilters[1];
    }
    this.getFiles();
  }

  /**
   * Load media files
   *
   * @param page Page number
   * @todo Add filter for getting only images for file selection
   */
  getFiles(page: number = 1): void {
    this.pagination.currentPage = page;
    this.loading = true;
    let ordering = '';
    if (this.sortField) {
      ordering = this.sortField.value;
    }
    if (this.sortOrder === Order.DESCENDING) {
      ordering = `-${ordering}`;
    }
    this.mediaService.getMedia({
      search: this.search || '',
      ext: this.extensionFilter.value,
      ordering,
    }, page).subscribe((response: ApiResponse<File>): void => {
      this.files = response.results;
      this.pagination.totalItems = response.count;
      this.loading = false;
      this.fileGroups.clear();
      if (this.sortField) {
        this.fileGroups.set('sorted', []);
        /**
         * Group files by date
         */
        for (const file of this.files) {
          this.fileGroups.get('sorted').push(file);
        }
      } else {
        /**
         * Group files by date
         */
        for (const file of this.files) {
          this.addFileToGroup(file);
        }
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  /**
   * Add given file to a group based on its date
   *
   * @param file File to add
   * @param unshift Whether or not unshift the file
   */
  addFileToGroup(file: File, unshift?: boolean): void {
    const created = new Date(file.created);
    const key = new Date(
      created.getFullYear(),
      created.getMonth(),
      created.getDate(),
      0, 0, 0, 0,
    ).toString();
    if (!this.fileGroups.has(key)) {
      this.fileGroups.set(key, []);
    }
    if (unshift) {
      this.fileGroups.get(key).unshift(file);
    } else {
      this.fileGroups.get(key).push(file);
    }
  }

  /**
   * On file selection
   *
   * @param file Selected file
   * @param key Group key
   */
  onChoose(file: File, key: string): void {
    if (this.selection) {
      this.choose.emit(file);
    } else {
      const modalRef: BsModalRef = this.modalService.show(FileModalComponent, {
        initialState: { file },
        class: 'full',
      });
      modalRef.content.onFileDelete.subscribe((id: string): void => {
        const index: number = this.fileGroups.get(key).findIndex(a => a.id === id);
        this.fileGroups.get(key).splice(index, 1);
        /**
         * Remove group as well if it was last item
         */
        if (!this.fileGroups.get(key).length) {
          this.fileGroups.delete(key);
        }
      });
    }
  }

  /**
   * @return Icon to represent this file
   * @param file File to get icon for
   */
  getFileIcon(file: File): IconDefinition {
    switch (file.ext) {
      case 'application/excel':
      case 'excel':
      case 'vnd.ms-excel':
      case 'x-excel':
      case 'x-msexcel':
        return faFileExcel;
      case 'application/mspowerpoint':
      case 'application/powerpoint':
      case 'application/vnd.ms-powerpoint':
      case 'application/x-mspowerpoint':
        return faFilePowerpoint;
      case 'application/x-zip-compressed':
      case 'application/x-zip':
      case 'application/zip':
      case 'application/compressed':
        return faFileArchive;
      case 'application/pdf':
        return faFilePdf;
      case 'application/msword':
        return faFileWord;
      default:
        return faFile;
    }
  }

  /**
   * Toggle sort order
   */
  toggleOrder(): void {
    if (this.sortOrder === Order.ASCENDING) {
      this.sortOrder = Order.DESCENDING;
    } else {
      this.sortOrder = Order.ASCENDING;
    }
    this.getFiles();
  }

  /**
   * Handle file being added to groups
   *
   * @param file File
   */
  onFileAdded(file: File): void {
    /**
     * If sorting was active then add the file to 'sorted' group, otherwise call {@link addFileToGroup} method.
     */
    if (this.sortField) {
      this.fileGroups.get('sorted').unshift(file);
    } else {
      this.addFileToGroup(file, true);
    }
  }

  /**
   * Order {@link fileGroups file groups} by date
   *
   * @param a Group
   * @param b Group
   */
  orderByDate(a: KeyValue<string, File[]>, b: KeyValue<string, File[]>): number {
    const aDate: number = new Date(a.key).getTime();
    const bDate: number = new Date(b.key).getTime();
    if (aDate < bDate) {
      return 1;
    }
    if (aDate > bDate) {
      return -1;
    }
    return 0;
  }
}
