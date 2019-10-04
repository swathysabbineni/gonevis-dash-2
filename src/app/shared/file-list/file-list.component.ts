import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MediaService } from '@app/components/dash/media/media.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { File } from '@app/interfaces/file';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { UtilService } from '@app/services/util/util.service';
import { FileModalComponent } from '@app/shared/file-modal/file-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
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
   * @todo Add filter for getting only images for file selection
   */
  getFiles(): void {
    this.mediaService.getMedia().subscribe((response: ApiResponse<File>): void => {
      this.files = response.results;
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
      const modal: BsModalRef = this.modalService.show(FileModalComponent, {
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
}
