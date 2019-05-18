import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public readonly baseApi: string = environment.api;

  constructor(private http: HttpClient) {
  }

  /**
   * Handles errors or failures from BackEnd callbacks.
   *
   * @param error
   *
   * A response that represents an error or failure, either from a
   * non-successful HTTP status, an error while executing the request,
   * or some other failure which occurred during the parsing of the response.
   *
   * Any error returned on the `Observable` response stream will be
   * wrapped in an `HttpErrorResponse` to provide additional context about
   * the state of the HTTP layer when the error occurred. The error property
   * will contain either a wrapped Error object or the error response returned
   * from the server.
   */
  public static handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error('Backend returned code:', error.status, 'body was: ', error.error);
    }
    // return an observable with a user-facing error message
    return throwError(error.error);
  }
}
