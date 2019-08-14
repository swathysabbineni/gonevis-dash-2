import { TeamRoles } from '@app/enums/team-roles';

export interface TeamMember<T> {
  role: TeamRoles;
  user: T;
}
