import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { AccountProperties, CreateAccountOptions } from './account.type';
import { AccountAggregate } from './account';

@Injectable()
export class AccountFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateAccountOptions): AccountAggregate {
    return this.eventPublisher.mergeObjectContext(
      new AccountAggregate({
        ...options,
        balance: 0,
        lockedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        version: 0,
      }),
    );
  }

  reconstitute(properties: AccountProperties): AccountAggregate {
    return this.eventPublisher.mergeObjectContext(
      new AccountAggregate(properties),
    );
  }
}
