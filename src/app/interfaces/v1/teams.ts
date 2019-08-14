import { TeamRoles } from '@app/enums/team-roles';
import { User } from '@app/interfaces/v1/user';
import { UserMin } from '@app/interfaces/v1/user-min';

export interface Teams {
  team: {
    role: TeamRoles;
    user: UserMin;
  }[];
  team_pending: {
    role: TeamRoles;
    user: User;
  }[];
}
