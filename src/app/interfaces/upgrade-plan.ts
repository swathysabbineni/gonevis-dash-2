import { Plan } from '@app/interfaces/v1/plan';

export interface UpgradePlan {
  name: string;
  sub: string;
  color: string;
  features: string[];
  plan?: Plan;
}
