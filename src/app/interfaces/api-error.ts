/**
 * Represents standard API error response
 */
export interface ApiError {
  [field: string]: any;

  non_field_errors?: string[];
  detail?: string;
}
