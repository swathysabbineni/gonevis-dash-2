import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {

  /**
   * Spinner diameter in px
   */
  @Input() diameter = 50;

  /**
   * Spinner color
   */
  @Input() color = '#2980b9';

  /**
   * Margin top class
   */
  @Input() margin = 0;
}
