import { AggregateRoot } from '@nestjs/cqrs';
import { NotificationProperties } from './notification.type';

export class NotificationAggregate extends AggregateRoot {
  private readonly id: string;
  private readonly accountId: string;
  private readonly to: string;
  private readonly subject: string;
  private readonly content: string;
  private readonly createdAt: Date;

  constructor(properties: NotificationProperties) {
    super();
    Object.assign(this, properties);
  }
}
