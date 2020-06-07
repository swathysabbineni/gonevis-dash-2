import { Component, OnInit, EventEmitter } from '@angular/core';
import { MetricStatItem } from '@app/enums/metric-stat-item';
import { MetricStatResolution } from '@app/enums/metric-stat-resolution';

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

  ngOnInit(): void {
    /**
     * Update statistics
     */
    setTimeout((): void => {
      this.statisticsRefresh.emit();
    });
  }
}
