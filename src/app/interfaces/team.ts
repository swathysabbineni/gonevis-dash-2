import { TeamMember } from '@app/interfaces/team-member';
import { UserSettings } from '@app/interfaces/user-settings';
import { UserTeam } from '@app/interfaces/user-team';

/**
 * Represents team API response
 */
export interface Team {
  team: TeamMember<UserTeam>[];
  team_pending: TeamMember<UserSettings>[];
}
