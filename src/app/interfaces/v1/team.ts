import { TeamMember } from '@app/interfaces/v1/team-member';
import { TeamMemberPending } from '@app/interfaces/v1/team-member-pending';

export interface Team {
  team: TeamMember[];
  team_pending: TeamMemberPending[];
}
