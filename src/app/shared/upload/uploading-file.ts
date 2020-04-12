import { ApiError } from '@app/interfaces/api-error';
import { File as FileMedia } from '@app/interfaces/file';
import { UploadProgress } from '@app/interfaces/upload-progress';

/**
 * Model for each file being uploaded.
 * It contains progress percentage, file's information and file's states (preparing, done and etc.).
 *
 * It's being used in {@link UploadComponent} to create a new instance for each file that has been selected or dropped.
 *
 * @usageNotes
 *
 * The following example creates a new instance and passes needed initial values and shows how to update properties.
 *
 * ```
 *   const uploadingFile: UploadingFile = new UploadingFile(file);
 *
 *   uploadingFile.updateProperty({
 *     done: true,
 *     color: 'success',
 *   });
 * ```
 *
 * @see UploadComponent.onFileSelected
 */
export class UploadingFile {
  /**
   * Setup units
   */
  private static readonly UNITS: string[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  /**
   * A number which represents upload progress percentage
   */
  progress: number;

  /**
   * Returned data from API call
   */
  data: FileMedia;

  /**
   * Determines whether or not file is being uploaded to backend to retrieve its URL
   */
  preparing: boolean;

  /**
   * Determines whether or not file is uploaded successfully
   */
  done: boolean;

  /**
   * API error
   */
  error: ApiError;

  /**
   * Current color based on state of the upload
   */
  color: 'success' | 'danger' | 'primary';

  /**
   * Human-readable file size
   */
  readableSize: string;

  /**
   * Mime type or in another words file's extension type
   */
  extension: string;

  constructor(file: File) {
    this.progress = 0;
    this.data = null;
    this.done = false;
    this.preparing = true;
    this.error = null;
    this.color = 'primary';
    this.readableSize = UploadingFile.readableBytes(file.size);
    if (file.type) {
      this.extension = file.type.split('/').pop().toLocaleUpperCase();
    } else if (file.name) {
      this.extension = file.name.split('.').pop().toLocaleUpperCase();
    }
  }

  /**
   * Converts a long string of bytes into a readable format e.g KB, MB, GB, TB, YB
   *
   * @param integer The number of bytes
   */
  private static readableBytes(integer: number): string {
    /**
     * Check if given number is negative
     */
    const isNegative: boolean = integer < 0;
    /**
     * Check if negative
     */
    if (isNegative) {
      integer = -integer;
    }
    /**
     * Check if given integer is less than 1
     */
    if (integer < 1) {
      return (isNegative ? '-' : '') + integer + ' B';
    }
    const exponent: number = Math.min(
      Math.floor(Math.log(integer) / Math.log(1000)),
      UploadingFile.UNITS.length - 1,
    );
    /**
     * Convert to number
     */
    integer = Number((integer / Math.pow(1000, exponent)).toFixed(2));
    /**
     * Convert number into readable format
     */
    return (isNegative ? '-' : '') + integer + ' ' + UploadingFile.UNITS[exponent];
  }

  /**
   * Update properties by given key value pairs in parameter
   *
   * @param properties Properties to update
   */
  updateProperty(properties: Partial<UploadProgress>): void {
    /**
     * Iterate through given property keys in parameter and update each property
     */
    Object.keys(properties).forEach((key: string): void => {
      this[key] = properties[key];
    });
  }
}
