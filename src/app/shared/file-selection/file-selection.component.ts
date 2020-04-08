import { Component, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { File as FileMedia } from '@app/interfaces/file';
import { FileListComponent } from '@app/shared/file-list/file-list.component';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-file-selection',
  templateUrl: './file-selection.component.html',
  styleUrls: ['./file-selection.component.scss'],
})
export class FileSelectionComponent {

  /**
   * Get tabs parent
   */
  @ViewChild('tabset') tabset: TabsetComponent;

  /**
   * On file selected
   */
  @Output() choose: EventEmitter<FileMedia> = new EventEmitter<FileMedia>();

  /**
   * Selected file ID
   */
  @Input() selected: string;

  /**
   * File list child to add files to
   */
  @ViewChild('fileListComponent') fileListComponent: FileListComponent;

  constructor(public modal: BsModalRef) {
  }

  /**
   * On upload finish
   *
   * @param file Uploaded file
   */
  onUpload(file: FileMedia): void {
    this.fileListComponent.files.unshift(file);
    this.tabset.tabs.find((tabDirective: TabDirective): boolean => tabDirective.id === 'images').active = true;
  }

  /**
   * On file selected
   *
   * @param file Selected file
   */
  onFileSelect(file: FileMedia): void {
    this.choose.emit(file);
    this.modal.hide();
  }
}
