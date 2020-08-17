import { Circle } from 'src/app/interfaces/v1/circle';
import { Subscriber } from 'src/app/interfaces/v1/subscriber';

/**
 * It's being used to provide the information about the create circle.
 */
export interface CircleCreated {
  /**
   * Created circle.
   */
  circle: Circle;
  /**
   * Selected followers to add to the created circle.
   */
  members: Subscriber[];
}
