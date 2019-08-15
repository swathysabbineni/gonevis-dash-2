import { TeamRoles } from '@app/enums/team-roles';
import { UserMin } from '@app/interfaces/v1/user-min';

export interface TeamMemberPending {
  user: UserMin;
  site: string;
  role: TeamRoles;
  email: string;
  created: string;
}
