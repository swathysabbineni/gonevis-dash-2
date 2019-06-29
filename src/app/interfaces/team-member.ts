/**
 * Represents team member structure
 */
export interface TeamMember<T> {
  role: number;
  user: T;
  email?: string;
  site?: string;
  created?: string;
}
