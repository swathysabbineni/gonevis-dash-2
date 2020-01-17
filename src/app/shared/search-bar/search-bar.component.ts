import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {

  readonly faSearch: IconDefinition = faSearch;
  readonly faTimes: IconDefinition = faTimes;

  /**
   * Search query (form control)
   */
  query: FormControl = new FormControl('');

  /**
   * On form submit
   */
  @Output() readonly search: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Submit search query (empty query means clear)
   */
  submit(): void {
    this.search.emit(this.query.value);
  }
}
