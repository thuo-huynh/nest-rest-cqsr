import { FindNotificationQuery } from './find-notification.query';
import { FindNotificationResult } from './result/find-notification-result';

export interface INotificationQuery {
  find: (options: FindNotificationQuery) => Promise<FindNotificationResult>;
}
