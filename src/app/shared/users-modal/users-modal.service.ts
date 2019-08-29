import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Subscriber } from '@app/interfaces/v1/subscriber';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersModalService {

  constructor(private http: HttpClient,
              private apiService: ApiService) { }

  getUsers(): Observable<ApiResponse<Subscriber>> {
    return this.http.get<ApiResponse<Subscriber>>(
      `${this.apiService.base.zero}website/site/${BlogService.currentBlog.id}/subscribers`);
  }
}
