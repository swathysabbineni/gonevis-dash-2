import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Environment } from '@app/interfaces/environment';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  /**
   * Being used in API params to indicate that the API which is being called is just for
   * checking if user is authenticated or not.
   * It's main usage is for preventing authentication modal from opening.
   */
  static readonly CHECKING_AUTH_PARAM = 'checking-auth';

  /**
   * Base API endpoint URL
   */
  readonly base: Environment['api'] = environment.api;

  constructor(private http: HttpClient) {
  }

  /**
   * Get an endpoint
   *
   * @param endpoint Endpoint to get
   */
  getEndpoint<T>(endpoint: string): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(endpoint);
  }
}
