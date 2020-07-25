import { Component, OnInit, EventEmitter } from '@angular/core';
import { MetricStatItem } from '@app/enums/metric-stat-item';
import { MetricStatResolution } from '@app/enums/metric-stat-resolution';
import { TeamRoles } from '@app/enums/team-roles';
import { BlogService } from '@app/services/blog/blog.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {

  /**
   * List of resolutions for statistics panel filter
   */
  readonly statisticsResolutions: MetricStatResolution[] = [
    MetricStatResolution.DAY,
    MetricStatResolution.WEEK,
    MetricStatResolution.MONTH,
    MetricStatResolution.YEAR,
  ];

  /**
   * List of items for statistics panel filter
   */
  readonly statisticsItems: { value: MetricStatItem, label: string }[] = [
    { value: MetricStatItem.VIEWS, label: 'VIEWS_STATISTICS' },
    { value: MetricStatItem.LIKES, label: 'LIKES_STATISTICS' },
    { value: MetricStatItem.COMMENTS, label: 'COMMENTS_STATISTICS' },
  ];

  /**
   * Refresh the statistics data
   */
  readonly statisticsRefresh = new EventEmitter<void>();

  /**
   * Selected resolution for statistics panel filter
   */
  statisticsResolution = this.statisticsResolutions[0];

  /**
   * Selected item for statistics panel filter
   */
  statisticsItem: { value: MetricStatItem, label: string } = this.statisticsItems[0];

  /**
   * Determines whether or not the user's role in current blog is editor
   */
  isEditor: boolean;

  ngOnInit(): void {
    this.isEditor = BlogService.currentBlog.role === TeamRoles.Editor;
    if (this.isEditor) {
      return;
    }
    /**
     * Update statistics
     */
    setTimeout((): void => {
      this.statisticsRefresh.emit();
    });
  }
}
