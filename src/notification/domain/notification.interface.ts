import { NotificationAggregate } from './notification';

export interface INotificationRepository {
  newId: () => string;
  save: (notification: NotificationAggregate) => Promise<void>;
}
