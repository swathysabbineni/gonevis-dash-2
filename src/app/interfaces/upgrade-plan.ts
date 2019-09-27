import { Plan } from '@app/interfaces/v1/plan';

/**
 * Payment plan which is used in upgrade page, main purpose is to store static variables for UI
 */
export interface UpgradePlan {
  name: string;
  sub: string;
  color: string;
  features: string[];
  plan?: Plan;
}
