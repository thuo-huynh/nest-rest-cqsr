import { IntegrationEventPublisherService } from '@app/module/message/intergration-event-publisher.service';
import { Topic } from '@app/module/message/message.enum';
import { IIntegrationEventPublisher } from '@app/module/message/message.interface';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccountClosedEvent } from 'src/account/domain/event/AccountClosedEvent';
import { AccountClosed } from '../account-closed.event';

@EventsHandler(AccountClosedEvent)
export class AccountClosedEventHandler
  implements IEventHandler<AccountClosedEvent>
{
  constructor(
    @Inject(IntegrationEventPublisherService)
    private readonly integrationEventPublisher: IIntegrationEventPublisher,
  ) {}
  async handle(event: AccountClosedEvent) {
    await this.integrationEventPublisher.publish(
      Topic.ACCOUNT_CLOSED,
      new AccountClosed(event.accountId, event.email),
    );
  }
}
