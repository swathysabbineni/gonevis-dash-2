import { ApiResponse } from '@app/interfaces/api-response';
import { Entry } from '@app/interfaces/zero/entry';

/**
 * It's being used to cache data in reader pages (explore, updates and bookmarks).
 */
export interface ReaderCache {
  /**
   * It's being used to prevent showing incorrect data.
   */
  key: string;
  /**
   * API response which holds the current data of the list.
   */
  response: ApiResponse<Entry>;
  /**
   * Scroll top position of element that is responsible for scrolling reader page.
   * Currently the elements's class is '.feed-scroller'.
   *
   * It's being used to revert scroll position of the page back to where it was.
   */
  scrollTopPosition?: number;
}
