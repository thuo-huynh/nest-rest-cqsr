import { IntegrationEventPublisherService } from '@app/module/message/intergration-event-publisher.service';
import { Topic } from '@app/module/message/message.enum';
import { IIntegrationEventPublisher } from '@app/module/message/message.interface';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AccountOpenedEvent } from 'src/account/domain/event/AccountOpenedEvent';
import { AccountOpened } from '../account-opened.event';

@EventsHandler(AccountOpenedEvent)
export class AccountOpenedEventHandler
  implements IEventHandler<AccountOpenedEvent>
{
  constructor(
    @Inject(IntegrationEventPublisherService)
    private readonly integrationEventPublisher: IIntegrationEventPublisher,
  ) {}
  async handle(event: AccountOpenedEvent) {
    await this.integrationEventPublisher.publish(
      Topic.ACCOUNT_OPENED,
      new AccountOpened(event.accountId, event.email),
    );
  }
}
