import Quill from 'quill';
import { Subject, Observable } from 'rxjs';

/**
 * Module for QuillJs to allow user to drag images from their file system into the editor and emits the files on drop
 */
export class ImageDragDrop {

  /**
   * File subject
   */
  private fileSubject: Subject<File> = new Subject<File>();

  quill: Quill;

  constructor(quill: Quill) {
    this.quill = quill;
    /**
     * On drop listener
     */
    quill.root.addEventListener('drop', this.onFileDrop.bind(this), false);
  }

  /**
   * Handle dropped files
   *
   * @param event DragEvent
   */
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
      [].forEach.call(event.dataTransfer.files, (file: File): void => {
        if (file.type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp|vnd\.microsoft\.icon)/i)) {
          this.fileSubject.next(file);
        }
      });
    }
  }

  /**
   * @returns File
   */
  file(): Observable<File> {
    return this.fileSubject.asObservable();
  }
}

Quill.register('modules/imageDragDrop', ImageDragDrop);
