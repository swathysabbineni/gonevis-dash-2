import { ApiResponse } from '@app/interfaces/api-response';
import { EntryFeed } from '@app/interfaces/entry-feed';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Observable } from 'rxjs';

/**
 * Represents a navigation item with routing icons
 */
export interface RouteNav {
  label: string;
  route: string;
  api: Observable<ApiResponse<EntryFeed>>;
  icon: IconProp;
}
