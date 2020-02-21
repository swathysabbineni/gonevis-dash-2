import { ApiError } from '@app/interfaces/api-error';
import { File } from '@app/interfaces/file';

/**
 * Represents an upload progress structure
 */
export interface UploadProgress {
  /**
   * A number which represents upload progress percentage
   */
  progress: number;
  /**
   * Returned data from API call
   */
  data: File;
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
}
