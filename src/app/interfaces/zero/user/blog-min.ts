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
  plan_name: 'Free' | 'Personal' | 'Professional';
  title: string;
  url: string;
}
