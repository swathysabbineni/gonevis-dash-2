import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@app/services/api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {

  constructor(private http: HttpClient,
              private api: ApiService) {
  }

  /**
   * Send a message as feedback
   *
   * @param message Feedback message
   */
  send(message: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api.base.zero}feedback/`, { message });
  }
}
