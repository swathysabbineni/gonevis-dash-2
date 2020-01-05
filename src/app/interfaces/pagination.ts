export interface Pagination {
  /**
   * Maximum number of items per page
   */
  itemsPerPage: number;
  /**
   * Number of items in total
   */
  totalItems: number;
  /**
   * Number of current page
   */
  currentPage: number;
}
