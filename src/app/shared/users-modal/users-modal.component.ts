import { Component, OnInit } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Metrics } from '@app/interfaces/v1/metrics';
import { Subscriber } from '@app/interfaces/v1/subscriber';
import { BlogService } from '@app/services/blog/blog.service';
import { UsersModalService } from '@app/shared/users-modal/users-modal.service';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-users-modal',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss'],
})
export class UsersModalComponent implements OnInit {

  /**
   * Metrics (data count, etc)
   */
  metrics: Metrics;

  modalRef: BsModalRef;

  /**
   * List of subscribers
   */
  subscribers: Subscriber[];

  constructor(private blogService: BlogService,
              private modalService: UsersModalService) {
  }

  ngOnInit(): void {
    /**
     * Get users
     */
    this.modalService.getUsers().subscribe((response: ApiResponse<Subscriber>): void => {
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
