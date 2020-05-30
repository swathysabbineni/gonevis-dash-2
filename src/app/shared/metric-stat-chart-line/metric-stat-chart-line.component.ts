import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges, EventEmitter, OnInit } from '@angular/core';
import { MetricStatItem } from '@app/enums/metric-stat-item';
import { MetricStatResolution } from '@app/enums/metric-stat-resolution';
import { ApiResponse } from '@app/interfaces/api-response';
import { MetricStat } from '@app/interfaces/v1/metric-stat';
import { BlogService } from '@app/services/blog/blog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-metric-stat-chart-line',
  templateUrl: './metric-stat-chart-line.component.html',
  styleUrls: ['./metric-stat-chart-line.component.scss'],
  providers: [DatePipe, DecimalPipe],
})
export class MetricStatChartLineComponent implements OnInit, OnChanges {

  private static readonly METRIC_ITEM_TEXT: Record<MetricStatItem, string> = {
    [MetricStatItem.LIKES]: 'LIKES',
    [MetricStatItem.VIEWS]: 'VIEWS',
    [MetricStatItem.COMMENTS]: 'COMMENTS',
  };

  private static readonly METRIC_RESOLUTION_DATE_FORMAT: Record<MetricStatResolution, string> = {
    [MetricStatResolution.DAY]: 'MMM dd',
    [MetricStatResolution.WEEK]: 'MMM dd',
    [MetricStatResolution.MONTH]: 'MMM',
    [MetricStatResolution.YEAR]: 'yyyy',
  };

  /**
   * Chart height
   */
  @Input() readonly height = 300;

  /**
   * Refresh data trigger
   */
  @Input() readonly refresh = new EventEmitter<void>();

  /**
   * Stats resolution
   * @see MetricStatResolution
   */
  @Input() resolution: MetricStatResolution = MetricStatResolution.DAY;

  /**
   * Stats item
   * @see MetricStatItem
   */
  @Input() item: MetricStatItem = MetricStatItem.VIEWS;

  /**
   * Chart schema
   */
  readonly schema = { domain: ['#2980b9'] };

  /**
   * Chart results and series
   */
  results: { name: string; series: { name: string; value: string | number; }[] }[] = [];

  /**
   * Blog metric stats
   */
  stats: MetricStat[];

  constructor(private blogService: BlogService,
              private translate: TranslateService,
              private date: DatePipe,
              private decimal: DecimalPipe) {
  }

  ngOnInit() {
    /**
     * Refresh the data on trigger
     */
    this.refresh.subscribe((): void => {
      this.stats = null;
      this.results = [];
      this.blogService.getMetricStat(this.item, {
        resolution: this.resolution,
      }).subscribe((data: ApiResponse<MetricStat>): void => {
        this.stats = data.results;
        this.results.push({
          name: this.translate.instant(MetricStatChartLineComponent.METRIC_ITEM_TEXT[this.item]),
          series: [],
        });
        for (const stat of this.stats) {
          this.results[0].series.push({
            name: this.date.transform(
              stat.date, MetricStatChartLineComponent.METRIC_RESOLUTION_DATE_FORMAT[this.resolution],
            ),
            value: stat.count,
          });
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resolution) {
      this.resolution = changes.resolution.currentValue;
      this.refresh.emit();
    } else if (changes.item) {
      this.item = changes.item.currentValue;
      this.refresh.emit();
    }
  }

  /**
   * Chart format method
   * @returns 1000 as 1,000
   */
  xAxisTickFormatting = (value: string): string => this.decimal.transform(value);
}

