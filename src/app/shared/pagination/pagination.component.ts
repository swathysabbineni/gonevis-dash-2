import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {

  /**
   * On page change event
   */
  @Output() pageChange: EventEmitter<number> = new EventEmitter();

  @Input() id = 'pagination';

  /**
   * Whether or not pagination should have margin
   */
  @Input() margin = true;

  constructor() {
  }
}
