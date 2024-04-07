import { IntegrationEventPublisherService } from '@app/module/message/intergration-event-publisher.service';
import { Topic } from '@app/module/message/message.enum';
import { IIntegrationEventPublisher } from '@app/module/message/message.interface';
import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DepositedEvent } from 'src/account/domain/event/DepositedEvent';
import { AccountDeposited } from '../deposit.event';

@EventsHandler(DepositedEvent)
export class DepositedEventHandler implements IEventHandler<DepositedEvent> {
  constructor(
    @Inject(IntegrationEventPublisherService)
    private readonly integrationEventPublisher: IIntegrationEventPublisher,
  ) {}

  async handle(event: DepositedEvent): Promise<void> {
    await this.integrationEventPublisher.publish(
      Topic.ACCOUNT_DEPOSITED,
      new AccountDeposited(event.accountId, event.email),
    );
  }
}
