import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MediaService } from '@app/components/dash/media/media.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { File } from '@app/interfaces/file';
import { Pagination } from '@app/interfaces/pagination';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { UtilService } from '@app/services/util/util.service';
import { FileModalComponent } from '@app/shared/file-modal/file-modal.component';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faFile } from '@fortawesome/free-solid-svg-icons/faFile';
import { faFileArchive } from '@fortawesome/free-solid-svg-icons/faFileArchive';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons/faFileExcel';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faFilePowerpoint } from '@fortawesome/free-solid-svg-icons/faFilePowerpoint';
import { faFileWord } from '@fortawesome/free-solid-svg-icons/faFileWord';
import { TranslateService } from '@ngx-translate/core';
import { PageChangedEvent } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
})
export class FileListComponent implements OnInit {

  /**
   * Selection mode
   */
  @Input() selection = false;

  /**
   * Selected file ID
   */
  @Input() selected: string;

  /**
   * File select event
   */
  @Output() choose: EventEmitter<File> = new EventEmitter<File>();

  /**
   * List of blog media files
   */
  files: File[];

  /**
   * API pagination data
   */
  pagination: Pagination;

  /**
   * API loading indicator
   */
  loading: boolean;

  constructor(public utils: UtilService,
              private mediaService: MediaService,
              private translate: TranslateService,
              private toast: ToastrService,
              private modalService: BsModalService) {
  }

  ngOnInit(): void {
    BlogService.blog.subscribe((blog: BlogMin): void => {
      if (blog) {
        this.getFiles();
      }
    });
  }

  /**
   * Load media files
   *
   * @param page Page number
   * @todo Add filter for getting only images for file selection
   */
  getFiles(page: number = 1): void {
    this.loading = true;
    this.mediaService.getMedia(page).subscribe((response: ApiResponse<File>): void => {
      this.files = response.results;
      this.pagination = {
        itemsPerPage: MediaService.PAGE_SIZE,
        totalItems: response.count,
      };
      this.loading = false;
    });
  }

  /**
   * On file selection
   *
   * @param file Selected file
   */
  onChoose(file: File): void {
    if (this.selection) {
      this.choose.emit(file);
    } else {
      this.modalService.show(FileModalComponent, {
        initialState: { file },
        class: 'full',
      });
      this.modalService.onHidden.subscribe((): void => {
        if (file.deleted) {
          this.files.splice(this.files.indexOf(file), 1);
        }
      });
    }
  }

  /**
   * Pagination event
   */
  pageChanged(event: PageChangedEvent) {
    this.getFiles(event.page);
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
}
