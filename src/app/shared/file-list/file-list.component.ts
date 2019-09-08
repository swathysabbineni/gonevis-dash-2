import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MediaService } from '@app/components/dash/media/media.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { File } from '@app/interfaces/file';
import { UtilService } from '@app/services/util/util.service';
import { TranslateService } from '@ngx-translate/core';

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
   * File select event
   */
  @Output() choose: EventEmitter<File> = new EventEmitter<File>();

  /**
   * List of blog media files
   */
  files: File[];

  constructor(public utils: UtilService,
              private mediaService: MediaService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.getFiles();
  }

  /**
   * Load media files
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
      this.files.splice(this.files.indexOf(file), 1);
    });
  }

  /**
   * On file selection
   *
   * @param file Selected file
   */
  onChoose(file: File): void {
    this.choose.emit(file);
  }
}
