import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Subscription } from '@app/interfaces/subscription';
import { Plan } from '@app/interfaces/v1/plan';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsUpgradeService {

  /**
   * CloudPayments
   */
  private readonly script: { src: string, loaded: boolean } = {
    src: 'https://widget.cloudpayments.ru/bundles/cloudpayments',
    loaded: false,
  };

  constructor(private http: HttpClient,
              private apiService: ApiService) {
  }

  /**
   * Load CloudPayments script
   *
   * @returns Promise that indicates whether CloudPayments widget loaded successfully or not
   */
  loadScript(): Promise<boolean> {
    return new Promise<boolean>((resolve: (value: boolean) => void): void => {
      if (!this.script.loaded) {
        /**
         * Load script
         */
        const scriptElement: HTMLScriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = this.script.src;
        /**
         * On load callback
         */
        scriptElement.onload = (): void => {
          this.script.loaded = true;
          resolve(true);
        };
        /**
         * On error callback
         */
        scriptElement.onerror = (): void => resolve(false);
        /**
         * Append script element to head element as a child
         */
        document.getElementsByTagName('head')[0].appendChild(scriptElement);
      } else {
        resolve(true);
      }
    });
  }

  /**
   * Get list of plans to upgrade
   */
  getPlans(): Observable<ApiResponse<Plan>> {
    return this.http.get<ApiResponse<Plan>>(`${this.apiService.base.v1}eskenas/plans/`);
  }

  /**
   * Get current blog subscription plan
   */
  getSubscription(): Observable<{ subscription: Subscription }> {
    const blogId: string = BlogService.currentBlog.id;
    return this.http.get<{ subscription: Subscription }>(
      `${this.apiService.base.v1}website/site/${blogId}/subscription/`,
    );
  }
}
