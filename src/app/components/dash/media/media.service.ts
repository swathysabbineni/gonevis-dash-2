import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  static readonly PAGE_SIZE = 24;

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
   * @param page API page
   * @param search Search text
   */
  getMedia(page: number = 1, search: string = ''): Observable<ApiResponse<FileMedia>> {
    return this.http.get<ApiResponse<FileMedia>>(
      `${this.api.base.v1}site/${BlogService.currentBlog.id}/dolphin/file/`,
      {
        params: {
          site: BlogService.currentBlog.id,
          search,
          limit: MediaService.PAGE_SIZE.toString(),
          offset: UtilService.getPageOffset(MediaService.PAGE_SIZE, page),
        },
      },
    );
  }

  /**
   * delete a file
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
  uploadUrl(payload: { file_name: string, file_size: number, mime_type: string }): Observable<UploadUrlResponse> {
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
  uploadToUrl(url: string, file: File, fields: UploadUrlResponse['post_data']['fields']): Observable<void | FileMedia> {
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
    return this.http.post<void | FileMedia>(url, payload);
  }

  /**
   * Post file key
   *
   * @param fileKey File key from the upload URL response
   */
  post(fileKey: string): Observable<FileMedia> {
    return this.http.post<FileMedia>(`${this.api.base.v1}site/${BlogService.currentBlog.id}/dolphin/file/`, {
      site: BlogService.currentBlog.id,
      file_key: fileKey,
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
    }, {
      params: { site: BlogService.currentBlog.id },
    });
  }
}
