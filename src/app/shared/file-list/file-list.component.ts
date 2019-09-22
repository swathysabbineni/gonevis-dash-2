import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MediaService } from '@app/components/dash/media/media.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { File } from '@app/interfaces/file';
import { BlogMin } from '@app/interfaces/zero/user/blog-min';
import { BlogService } from '@app/services/blog/blog.service';
import { UtilService } from '@app/services/util/util.service';
import { TranslateService } from '@ngx-translate/core';
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
              private toast: ToastrService) {
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
   * Delete a file
   *
   * @param file File to delete
   */
  delete(file: File): void {
    if (!confirm(this.translate.instant('CONFORM_DELETE_FILE'))) {
      return;
    }
    file.loading = true;
    this.mediaService.delete(file.id).subscribe((): void => {
      this.toast.info(this.translate.instant('TOAST_DELETE'), file.file_name);
      this.files.splice(this.files.indexOf(file), 1);
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
    }
  }
}
