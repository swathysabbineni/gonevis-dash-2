import { TeamMember } from '@app/interfaces/v1/team-member';
import { User } from '@app/interfaces/v1/user';
import { UserMin } from '@app/interfaces/v1/user-min';

export interface Team {
  team: TeamMember<UserMin>[];
  team_pending: TeamMember<User>[];
}
