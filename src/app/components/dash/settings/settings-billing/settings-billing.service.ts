import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Transaction } from '@app/interfaces/transaction';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsBillingService {

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Get transactions list
   */
  getTransactions(): Observable<ApiResponse<Transaction>> {
    /**
     * Setup http params
     */
    const httpParams: HttpParams = new HttpParams().set('limit', '12');
    return this.http.get<ApiResponse<Transaction>>(
      `${this.apiService.base.v1}site/${BlogService.currentBlog.id}/eskenas/transactions/`,
      {
        params: httpParams,
      },
    );
  }

  /**
   * Cancel subscription
   *
   * @param planId Plan ID
   */
  cancelSubscription(planId: string): Observable<void> {
    const blogId: string = BlogService.currentBlog.id;
    return this.http.post<void>(
      `${this.apiService.base.v1}site/${blogId}/eskenas/subscriptions/${planId}/cancel-subscription/`,
      null,
    );
  }
}
