import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { File } from '@app/interfaces/file';
import { UtilService } from '@app/services/util/util.service';
import { MediaService } from './media.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent implements OnInit {

  files: File[];

  constructor(public utils: UtilService,
              private mediaService: MediaService) {
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
}
