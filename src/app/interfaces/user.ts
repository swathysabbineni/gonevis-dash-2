import { Media } from '@app/interfaces/media';

export interface User {
  id: string;
  username: string;
  name?: string;
  display_name: string;
  media: Media;
  location?: string;
  about?: string;
  date_joined: string;
  updated: string;
  subscribed_sites_count: number;
  collaborating_sites_count: number;
}

