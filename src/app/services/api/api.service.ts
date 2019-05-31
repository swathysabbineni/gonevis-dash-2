import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  /**
   * Base API endpoint URL
   */
  readonly base: { v1: string, zero: string } = environment.api;

  constructor(private http: HttpClient) {
  }


  /**
   * Get endpoint
   *
   * @param endpoint Endpoint to get
   */
  getEndpoint<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(endpoint);
  }
}
