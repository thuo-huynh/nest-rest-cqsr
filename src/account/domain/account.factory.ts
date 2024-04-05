import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { AccountProperties, CreateAccountOptions } from './account.type';
import { IAccount } from './account.interface';
import { Account } from './account';

@Injectable()
export class AccountFactory {
  @Inject(EventPublisher) private readonly eventPublisher: EventPublisher;

  create(options: CreateAccountOptions): IAccount {
    return this.eventPublisher.mergeObjectContext(
      new Account({
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

  reconstitute(properties: AccountProperties): IAccount {
    return this.eventPublisher.mergeObjectContext(new Account(properties));
  }
}
