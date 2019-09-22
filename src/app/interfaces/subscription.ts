import { Plan } from '@app/interfaces/v1/plan';

export interface Subscription {
  id: string;
  plan: Plan;
  created: Date;
  active: boolean;
}
