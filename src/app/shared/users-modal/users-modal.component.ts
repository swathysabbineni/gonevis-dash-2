import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Metrics } from '@app/interfaces/v1/metrics';
import { Subscriber } from '@app/interfaces/v1/subscriber';
import { BlogService } from '@app/services/blog/blog.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss'],
})
export class UsersModalComponent implements OnInit {

  /**
   * Icons
   */
  readonly times: IconDefinition = faTimes;

  /**
   * Metrics (data count, etc)
   */
  metrics: Metrics;

  /**
   * List of subscribers
   */
  subscribers: Subscriber[];

  constructor(private blogService: BlogService,
              public modal: BsModalRef) {
  }

  ngOnInit(): void {
    /**
     * Get users
     */
    this.blogService.getSubscribers().subscribe((response: ApiResponse<Subscriber>): void => {
      this.subscribers = response.results;
    });
    /**
     * Load metrics
     */
    this.blogService.getMetrics().subscribe((data: Metrics): void => {
      this.metrics = data;
    });
  }
}
