import { TeamRoles } from '@app/enums/team-roles';

/**
 * Represents minimal blog structure for user
 */
export interface BlogMin {
  id: string;
  media: {
    logo: {
      thumbnail_48x48: string
    }
  };
  role: TeamRoles;
  title: string;
  url: string;
}
