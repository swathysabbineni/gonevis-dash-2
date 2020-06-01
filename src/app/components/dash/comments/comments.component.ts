import { Component, OnInit } from '@angular/core';
import { CommentStatus } from '@app/enums/comment-status';
import { Order } from '@app/enums/order';
import { ApiResponse } from '@app/interfaces/api-response';
import { Filter } from '@app/interfaces/filter';
import { Pagination } from '@app/interfaces/pagination';
import { Sort } from '@app/interfaces/sort';
import { Comment } from '@app/interfaces/v1/comment';
import { UtilService } from '@app/services/util/util.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCalendar } from '@fortawesome/free-regular-svg-icons/faCalendar';
import { faComment } from '@fortawesome/free-regular-svg-icons/faComment';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons/faThumbsUp';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { faSort } from '@fortawesome/free-solid-svg-icons/faSort';
import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons/faSortAmountDown';
import { faSortAmountUp } from '@fortawesome/free-solid-svg-icons/faSortAmountUp';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CommentsService } from './comments.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit {

  readonly filter: IconDefinition = faFilter;
  readonly sort: IconDefinition = faSort;
  readonly comment: IconDefinition = faComment;
  readonly like: IconDefinition = faThumbsUp;
  readonly ellipsis: IconDefinition = faEllipsisV;
  readonly times: IconDefinition = faTimes;
  readonly ascending: IconDefinition = faSortAmountUp;
  readonly descending: IconDefinition = faSortAmountDown;

  readonly order = Order;

  /**
   * Status to choice situation comment
   */
  status = CommentStatus;

  /**
   * Current search text
   */
  search: string;

  /**
   * List of comments
   */
  comments: Comment[];

  /**
   * API pagination data
   */
  pagination: Pagination = {
    itemsPerPage: CommentsService.PAGE_SIZE,
    totalItems: 0,
    currentPage: 1,
    id: 'pagination',
  };

  /**
   * API loading indicator
   */
  loading = false;

  /**
   * List of status filters
   */
  readonly statusFilters: Filter<CommentStatus>[] = [{
    value: '',
    label: 'ANY_STATUS',
  }, {
    value: CommentStatus.Active,
    label: 'ACTIVE',
  }, {
    value: CommentStatus.Pending,
    label: 'PENDING',
  }, {
    value: CommentStatus.Hidden,
    label: 'HIDDEN',
  }];

  /**
   * List of sorting fields
   */
  readonly sortFields: Sort[] = [{
    value: 'vote_count',
    label: 'LIKES',
    icon: this.like,
  }, {
    value: 'created',
    label: 'CREATE_DATE',
    icon: faCalendar,
  }];

  /**
   * Current sort field
   */
  sortField: Sort;

  /**
   * Sorting order (ascending or descending)
   */
  sortOrder: Order = Order.ASCENDING;

  /**
   * Current status filter
   */
  statusFilter: Filter<CommentStatus> = this.statusFilters[0];

  constructor(public utils: UtilService,
              private commentsService: CommentsService,
              private translate: TranslateService,
              private toast: ToastrService) {
  }

  ngOnInit(): void {
    /**
     * Get comments
     */
    this.getComments();
  }

  /**
   * Get comments
   *
   * @param page Page number
   */
  getComments(page: number = 1): void {
    this.pagination.currentPage = page;
    this.loading = true;
    let ordering = '';
    if (this.sortField) {
      ordering = this.sortField.value;
    }
    if (this.sortOrder === Order.DESCENDING) {
      ordering = `-${ordering}`;
    }
    this.commentsService.getComments({
      search: this.search || '',
      status: this.statusFilter.value,
      ordering,
    }, page).subscribe((response: ApiResponse<Comment>): void => {
      this.pagination.totalItems = response.count;
      this.comments = response.results;
      this.loading = false;
    });
  }

  /**
   * Set comment status
   *
   * @param comment Comment to update
   * @param status Status to set
   */
  update(comment: Comment, status: CommentStatus): void {
    if (comment.status === status) {
      return;
    }
    comment.loading = true;
    comment.status = status;
    this.commentsService.updateComment(comment.id, { status }).subscribe((data: Comment): void => {
      comment.loading = false;
      comment.status = data.status;
    });
  }

  /**
   * Delete a comment
   *
   * @param comment Comment to delete
   */
  delete(comment: Comment): void {
    if (!confirm(this.translate.instant('CONFORM_DELETE_COMMENT'))) {
      return;
    }
    comment.loading = true;
    this.commentsService.deleteComment(comment.id).subscribe((): void => {
      this.toast.info(this.translate.instant('TOAST_DELETE'), this.translate.instant('COMMENT'));
      this.comments.splice(this.comments.indexOf(comment), 1);
    });
  }


  /**
   * Toggle sort order
   */
  toggleOrder(): void {
    if (this.sortOrder === Order.ASCENDING) {
      this.sortOrder = Order.DESCENDING;
    } else {
      this.sortOrder = Order.ASCENDING;
    }
    this.getComments();
  }
}
