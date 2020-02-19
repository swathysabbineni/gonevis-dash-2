import { Plan } from '@app/shared/locked-feature/shared/enums/plan';

export interface PlanData {
  plan: Plan;
  name: string;
  info: string;
  color: string;
}
