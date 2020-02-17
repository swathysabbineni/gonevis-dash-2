import { File as FileMedia } from '@app/interfaces/file';

/**
 * Represents an upload progress structure.
 *
 * @see UploadService
 */
export interface UploadProgress {
  /**
   * A number which represents upload progress percentage
   */
  progress: number;
  /**
   * Returned data from API call
   */
  data?: FileMedia;
}
