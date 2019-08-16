import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { File } from '@app/interfaces/file';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MediaService {

  constructor(private http: HttpClient,
              private api: ApiService) {
  }

  /**
   * Get blog media
   */
  getMedia(): Observable<ApiResponse<File>> {
    return this.http.get<ApiResponse<File>>(`${this.api.base.v1}dolphin/file/`, {
      params: { site: BlogService.currentBlog.id },
    });
  }
}
