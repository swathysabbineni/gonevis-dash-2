import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileExtension } from '@app/enums/file-extension';
import { ApiResponse } from '@app/interfaces/api-response';
import { File as FileMedia } from '@app/interfaces/file';
import { UploadUrlResponse } from '@app/interfaces/v1/upload-url-response';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { UtilService } from '@app/services/util/util.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {

  /**
   * API page size
   */
  static readonly PAGE_SIZE = 50;

  /**
   * Media upload accept list
   */
  static readonly acceptList = [
    'application/xml',
    'text/xml',
    'image/jpeg',
    'image/pjpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/x-iwork-keynote-sffkey',
    'application/mspowerpoint',
    'application/powerpoint',
    'application/vnd.ms-powerpoint',
    'application/x-mspowerpoint',
    'application/vnd.oasis.opendocument.text',
    'application/excel',
    'application/vnd.ms-excel',
    'application/x-excel',
    'application/x-msexcel',
    'application/xml',
    'text/xml',
    'application/x-compressed',
    'application/x-zip-compressed',
    'application/zip',
    'multipart/x-zip',
    'audio/mpeg3',
    'audio/mpeg',
    'audio/x-mpeg-3',
    'video/mpeg',
    'video/x-mpeg',
    'audio/x-m4a',
    'audio/ogg',
    'audio/wav',
    'audio/x-wav',
  ];

  constructor(private http: HttpClient,
              private api: ApiService) {
  }

  /**
   * Get blog media
   *
   * @param filter API filters
   * @param page API page
   */
  getMedia(
    filter: {
      search?: string,
      ordering?: string,
      ext?: FileExtension | '',
      limit?: number,
    } = {},
    page: number = 1,
  ): Observable<ApiResponse<FileMedia>> {
    if (!filter.ext) {
      delete filter.ext;
    }
    return this.http.get<ApiResponse<FileMedia>>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/dolphin/file/`,
      {
        params: Object.assign(filter, {
          limit: (filter.limit || MediaService.PAGE_SIZE).toString(),
          offset: UtilService.getPageOffset(filter.limit || MediaService.PAGE_SIZE, page),
        }),
      },
    );
  }

  /**
   * Delete a file
   *
   * @param id File ID
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api.base.v1}site/${BlogService.currentBlog.id}/dolphin/file/${id}/`);
  }

  /**
   * Request to get the upload URL for file
   *
   * @param payload File payload
   */
  uploadUrl(payload: {
    file_name: string,
    file_size: number,
    mime_type: string,
    is_optimized: boolean
  }): Observable<UploadUrlResponse> {
    return this.http.post<UploadUrlResponse>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/upload-url/`, payload,
    );
  }

  /**
   * Upload to the requested URL for file
   *
   * @param url Upload URL
   * @param file File to upload
   * @param fields Upload fields
   */
  uploadToUrl(url: string, file: File, fields: UploadUrlResponse['post_data']['fields']):
    Observable<HttpEvent<FileMedia>> {
    const payload: FormData = new FormData();
    for (const field in fields) {
      if (fields[field]) {
        payload.append(field, fields[field]);
      }
    }
    payload.append('file', file);
    if (environment.name === 'local') {
      payload.append('site', BlogService.currentBlog.id);
    }
    /**
     * Create an HTTP POST request and pass the form with option to report progress
     */
    const req = new HttpRequest('POST', url, payload, {
      reportProgress: true,
    });
    return this.http.request<FileMedia>(req);
  }

  /**
   * Post file key
   *
   * @param fileKey File key from the upload URL response.
   * @param isOptimized Determines whether or not file should be optimized.
   */
  post(fileKey: string, isOptimized: boolean): Observable<FileMedia> {
    return this.http.post<FileMedia>(`${this.api.base.v1}site/${BlogService.currentBlog.id}/dolphin/file/`, {
      file_key: fileKey,
      is_optimized: isOptimized,
    });
  }

  /**
   * Update media file (name and description)
   *
   * @param id File ID
   * @param payload New file name and description data
   */
  update(id: string, payload: FileMedia['meta_data']): Observable<FileMedia> {
    return this.http.put<FileMedia>(`${this.api.base.v1}site/${BlogService.currentBlog.id}/dolphin/file/${id}/`, {
      meta_data: payload,
    });
  }
}
