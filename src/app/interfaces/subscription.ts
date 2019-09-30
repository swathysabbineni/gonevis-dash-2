import { Plan } from '@app/interfaces/v1/plan';

/**
 * Interface for payment subscription plan
 */
export interface Subscription {
  id: string;
  plan: Plan;
  created: Date;
  active: boolean;
}
