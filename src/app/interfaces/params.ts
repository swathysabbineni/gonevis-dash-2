/**
 * Represents HTTP params structure
 */
export interface Params {
  [param: string]: null | boolean | number | string | (number | string)[];
}
