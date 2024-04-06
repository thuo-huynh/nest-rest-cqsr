import {
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { IAccount } from './account.interface';
import { ErrorMessage } from './account.message';
import { AccountProperties } from './account.type';
import { AccountClosedEvent } from './event/AccountClosedEvent';
import { AccountOpenedEvent } from './event/AccountOpenedEvent';
import { DepositedEvent } from './event/DepositedEvent';
import { PasswordUpdatedEvent } from './event/PasswordUpdatedEvent';
import { WithdrawnEvent } from './event/WithdrawnEvent';

export class AccountAggregate extends AggregateRoot implements IAccount {
  private readonly id: string;
  private readonly name: string;
  private readonly email: string;
  private password: string;
  private balance: number;
  private lockedAt: Date | null;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private deletedAt: Date | null;
  private version: number;

  constructor(properties: AccountProperties) {
    super();
    Object.assign(this, properties);
  }

  compareId(id: string): boolean {
    return id === this.id;
  }

  open(): void {
    this.apply(new AccountOpenedEvent(this.id, this.email));
  }

  updatePassword(password: string): void {
    this.password = password;
    this.updatedAt = new Date();
    this.apply(new PasswordUpdatedEvent(this.id, this.email));
  }

  withdraw(amount: number): void {
    if (amount < 1)
      throw new InternalServerErrorException(
        ErrorMessage.CAN_NOT_WITHDRAW_UNDER_1,
      );
    if (this.balance < amount)
      throw new UnprocessableEntityException(
        ErrorMessage.REQUESTED_AMOUNT_EXCEEDS_YOUR_WITHDRAWAL_LIMIT,
      );
    this.balance -= amount;
    this.updatedAt = new Date();
    this.apply(new WithdrawnEvent(this.id, this.email));
  }

  deposit(amount: number): void {
    if (amount < 1)
      throw new InternalServerErrorException(
        ErrorMessage.CAN_NOT_DEPOSIT_UNDER_1,
      );
    this.balance += amount;
    this.updatedAt = new Date();
    this.apply(new DepositedEvent(this.id, this.email));
  }

  close(): void {
    if (this.balance > 0)
      throw new UnprocessableEntityException(
        ErrorMessage.ACCOUNT_BALANCE_IS_REMAINED,
      );
    this.deletedAt = new Date();
    this.updatedAt = new Date();
    this.apply(new AccountClosedEvent(this.id, this.email));
  }

  lock(): void {
    if (this.lockedAt)
      throw new UnprocessableEntityException(ErrorMessage.ACCOUNT_IS_LOCKED);
    this.lockedAt = new Date();
    this.updatedAt = new Date();
    this.version += 1;
  }
}
