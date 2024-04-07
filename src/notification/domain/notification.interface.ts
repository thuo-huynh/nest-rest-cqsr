import { NotificationAggregate } from './notification';

export interface NotificationRepository {
  newId: () => string;
  save: (notification: NotificationAggregate) => Promise<void>;
}
