import { EntityIdTransformer } from '@app/module/database/database.interface';
import {
  EntityId,
  writeConnection,
} from '@app/module/database/database.service';
import { EntityIdTransformerService } from '@app/module/database/transformer.service';
import { Inject, Injectable } from '@nestjs/common';
import { NotificationAggregate } from 'src/notification/domain/notification';
import { INotificationRepository } from 'src/notification/domain/notification.interface';
import { NotificationEntity } from '../entity/NotificationEntity';
import { NotificationProperties } from 'src/notification/domain/notification.type';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @Inject(EntityIdTransformerService)
    private readonly entityIdTransformer: EntityIdTransformer,
  ) {}

  newId(): string {
    return new EntityId().toString();
  }

  async save(notification: NotificationAggregate): Promise<void> {
    await writeConnection.manager
      .getRepository(NotificationEntity)
      .save(this.modelToEntity(notification));
  }

  private modelToEntity(model: NotificationAggregate): NotificationEntity {
    const properties = JSON.parse(
      JSON.stringify(model),
    ) as NotificationProperties;
    return Object.assign(new NotificationEntity(), {
      ...properties,
      id: this.entityIdTransformer.to(properties.id),
      accountId: this.entityIdTransformer.to(properties.accountId),
    });
  }
}
