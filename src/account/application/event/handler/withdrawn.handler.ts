import { IntegrationEventPublisherService } from '@app/module/message/intergration-event-publisher.service';
import { Topic } from '@app/module/message/message.enum';
import { IIntegrationEventPublisher } from '@app/module/message/message.interface';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { WithdrawnEvent } from 'src/account/domain/event/WithdrawnEvent';
import { AccountWithdrawn } from '../withdrawn.event';

@EventsHandler(WithdrawnEvent)
export class WithdrawnEventHandler implements IEventHandler<WithdrawnEvent> {
  constructor(
    @Inject(IntegrationEventPublisherService)
    private readonly integrationEventPublisher: IIntegrationEventPublisher,
  ) {}
  async handle(event: WithdrawnEvent): Promise<void> {
    await this.integrationEventPublisher.publish(
      Topic.ACCOUNT_WITHDRAWN,
      new AccountWithdrawn(event.accountId, event.email),
    );
  }
}
