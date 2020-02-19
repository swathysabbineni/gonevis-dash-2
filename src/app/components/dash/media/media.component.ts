import { Component, ViewChild } from '@angular/core';
import { File } from '@app/interfaces/file';
import { FileListComponent } from '@app/shared/file-list/file-list.component';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})
export class MediaComponent {

  /**
   * File list child to add files to
   */
  @ViewChild(FileListComponent) fileListComponent: FileListComponent;

  /**
   * On upload finish
   *
   * @param file Uploaded file
   */
  onUpload(file: File): void {
    this.fileListComponent.files.unshift(file);
  }
}
