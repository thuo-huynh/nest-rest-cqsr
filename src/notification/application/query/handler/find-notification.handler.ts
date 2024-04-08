import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotificationQuery } from 'src/notification/infrastructure/query/notification.query';
import { FindNotificationQuery } from '../find-notification.query';
import { INotificationQuery } from '../notification-query.interface';
import { FindNotificationResult } from '../result/find-notification-result';

@QueryHandler(FindNotificationQuery)
export class FindNotificationHandler
  implements IQueryHandler<FindNotificationQuery, FindNotificationResult>
{
  constructor(
    @Inject(NotificationQuery)
    private readonly notificationQuery: INotificationQuery,
  ) {}

  execute(query: FindNotificationQuery): Promise<FindNotificationResult> {
    return this.notificationQuery.find(query);
  }
}
