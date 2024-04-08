import { EntityIdTransformer } from '@app/module/database/database.interface';
import { readConnection } from '@app/module/database/database.service';
import { EntityIdTransformerService } from '@app/module/database/transformer.service';
import { Inject, Injectable } from '@nestjs/common';
import { FindNotificationQuery } from 'src/notification/application/query/find-notification.query';
import { INotificationQuery } from 'src/notification/application/query/notification-query.interface';
import { FindNotificationResult } from 'src/notification/application/query/result/find-notification-result';
import { NotificationEntity } from '../entity/NotificationEntity';

@Injectable()
export class NotificationQuery implements INotificationQuery {
  constructor(
    @Inject(EntityIdTransformerService)
    private readonly entityIdTransformer: EntityIdTransformer,
  ) {}

  async find(options: FindNotificationQuery): Promise<FindNotificationResult> {
    return readConnection
      .getRepository(NotificationEntity)
      .find({
        ...options,
        where: {
          to: options.to,
          accountId: options.accountId
            ? this.entityIdTransformer.to(options.accountId)
            : undefined,
        },
      })
      .then((entities) => ({
        notifications: entities.map((entity) => ({
          id: this.entityIdTransformer.from(entity.id),
          to: entity.to,
          subject: entity.subject,
          content: entity.content,
          createdAt: entity.createdAt,
        })),
      }));
  }
}
