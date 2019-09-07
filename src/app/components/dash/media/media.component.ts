import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { File } from '@app/interfaces/file';
import { UtilService } from '@app/services/util/util.service';
import { TranslateService } from '@ngx-translate/core';
import { MediaService } from './media.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent implements OnInit {

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
   * On upload finish
   *
   * @param file Uploaded file
   */
  onUpload(file: File): void {
    this.files.unshift(file);
  }
}
