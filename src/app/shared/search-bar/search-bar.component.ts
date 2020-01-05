import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {

  /**
   * Current loading state
   */
  private loadingState: boolean;

  /**
   * API loading indicator setter
   */
  @Input() set loading(value: boolean) {
    this.loadingState = value;
    if (value) {
      this.queryControl.disable();
    } else {
      this.queryControl.enable();
    }
  }

  /**
   * API loading indicator getter
   */
  get loading(): boolean {
    return this.loadingState;
  }

  /**
   * On form submit
   */
  @Output() readonly search: EventEmitter<string> = new EventEmitter<string>();

  /**
   * FontAwesome search icon
   */
  readonly faSearch: IconDefinition = faSearch;

  /**
   * FontAwesome close icon
   */
  readonly faTimes: IconDefinition = faTimes;

  /**
   * Query control for searching
   */
  queryControl: FormControl = new FormControl('');

  constructor() {
  }

  /**
   * Emit query value
   *
   * @param clearInput Whether or not input should be empty
   */
  emitQuery(clearInput: boolean = false): void {
    /**
     * Clear input
     */
    if (clearInput) {
      this.queryControl.setValue('');
    }
    /**
     * Emit query value
     */
    this.search.emit(this.queryControl.value);
  }
}
