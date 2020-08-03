import { ObjectType } from '@app/enums/object-type';

export interface Vote {
  object_pk: string;
  object_type: ObjectType;
  title: string;
  created: string;
}
