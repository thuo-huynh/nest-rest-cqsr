import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { NotificationAggregate } from './notification';
import {
  CreateNotificationOptions,
  NotificationProperties,
} from './notification.type';

@Injectable()
export class NotificationFactory {
  constructor(private readonly eventPublisher: EventPublisher) {}

  create(options: CreateNotificationOptions): NotificationAggregate {
    return this.eventPublisher.mergeObjectContext(
      new NotificationAggregate({ ...options, createdAt: new Date() }),
    );
  }

  reconstitute(properties: NotificationProperties): NotificationAggregate {
    return this.eventPublisher.mergeObjectContext(
      new NotificationAggregate(properties),
    );
  }
}
