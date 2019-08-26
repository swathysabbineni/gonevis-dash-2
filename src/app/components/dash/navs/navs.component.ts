import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavsService } from '@app/components/dash/navs/navs.service';
import { Nav } from '@app/interfaces/v1/nav';

@Component({
  selector: 'app-navs',
  templateUrl: './navs.component.html',
  styleUrls: ['./navs.component.scss'],
})
export class NavsComponent implements OnInit {

  /**
   * Navigation list
   */
  navigations: Nav[] = [];

  /**
   * API loading indicator
   */
  loading: boolean;

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private navsService: NavsService) {
  }

  ngOnInit(): void {
    this.loading = true;
    /**
     * Get navigations
     */
    this.navsService.getNavs().subscribe((data: { navigation: Nav[] }): void => {
      this.navigations = data.navigation;
      this.loading = false;

      /**
       * Subscribe to route's query params
       */
      if (history.state.add) {
        this.navigations.push({
          label: history.state.add.label,
          url: history.state.add.url,
        });
      }
    });
  }

  /**
   * Update navigations
   */
  update(): void {
    this.loading = true;
    /**
     * Update each navigation's sort number by their indexes
     */
    this.navigations.map<void>((navigation: Nav, index: number): void => {
      navigation.sort_number = index;
    });
    this.navsService.update(this.navigations).subscribe((data: any): void => {
      this.navigations = data.navigation;
      this.loading = false;
    });
  }

  /**
   * Create new navigation
   */
  add(): void {
    this.navigations.push({
      label: 'New nav',
      url: '/',
      sort_number: this.navigations.length + 1,
    });
  }

  /**
   * On navigation drop callback
   *
   * @param event On drop event
   */
  drop(event: CdkDragDrop<Nav[]>): void {
    moveItemInArray(this.navigations, event.previousIndex, event.currentIndex);
  }
}
