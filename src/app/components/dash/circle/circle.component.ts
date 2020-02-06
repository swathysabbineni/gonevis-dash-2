import { Component, OnInit } from '@angular/core';
import { CircleService } from '@app/components/dash/circle/circle.service';
import { ApiResponse } from '@app/interfaces/api-response';
import { CircleMin } from '@app/interfaces/v1/circle-min';
import { Subscriber } from '@app/interfaces/v1/subscriber';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';

@Component({
  selector: 'app-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.scss'],
})
export class CircleComponent implements OnInit {

  faDelete: IconDefinition = faTrash;

  /**
   * List of blog circles
   */
  circles: CircleMin[];

  /**
   * List of circle members
   */
  circleMembers: Subscriber[];

  constructor(private circleService: CircleService) {
  }

  ngOnInit(): void {
    /**
     * Load the circles
     */
    this.circleService.list().subscribe((data: CircleMin[]): void => {
      this.circles = data;
      /**
       * Load circle members
       */
      for (const circle of this.circles) {
        this.circleService.getMembers(circle.id).subscribe((members: ApiResponse<Subscriber>): void => {
          this.circleMembers = members.results;
        });
      }
    });
  }
}
