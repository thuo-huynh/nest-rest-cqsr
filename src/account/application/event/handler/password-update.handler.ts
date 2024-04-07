import { IntegrationEventPublisherService } from '@app/module/message/intergration-event-publisher.service';
import { Topic } from '@app/module/message/message.enum';
import { IIntegrationEventPublisher } from '@app/module/message/message.interface';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { PasswordUpdatedEvent } from 'src/account/domain/event/PasswordUpdatedEvent';
import { AccountPasswordUpdated } from '../password-update.event';

@EventsHandler(PasswordUpdatedEvent)
export class PasswordUpdatedEventHandler
  implements IEventHandler<PasswordUpdatedEvent>
{
  constructor(
    @Inject(IntegrationEventPublisherService)
    private readonly integrationEventPublisher: IIntegrationEventPublisher,
  ) {}
  async handle(event: PasswordUpdatedEvent): Promise<void> {
    await this.integrationEventPublisher.publish(
      Topic.ACCOUNT_PASSWORD_UPDATED,
      new AccountPasswordUpdated(event.accountId, event.email),
    );
  }
}
