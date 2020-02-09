import { SubscriberUser } from '@app/interfaces/v1/subscriber-user';

export interface Subscriber {
  id: string;
  user: SubscriberUser;
  created: string;
}
