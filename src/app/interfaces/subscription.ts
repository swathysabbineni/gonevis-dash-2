import { Plan } from '@app/interfaces/plan';

export interface Subscription {
  id: string;
  plan: Plan;
  created: Date;
  active: boolean;
}
