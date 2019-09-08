/**
 * Fields change based on the environment
 */
export interface UploadUrlResponse {
  post_data: {
    url: string;
    site?: string;
    fields: {
      acl: string;
      'Content-Type': string;
      key?: string;
      AWSAccessKeyId?: string;
      policy?: string;
      signature?: string;
    };
  };
}
