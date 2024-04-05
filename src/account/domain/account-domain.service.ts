import { IAccount } from './account.interface';

export class RemittanceOptions {
  readonly account: IAccount;
  readonly receiver: IAccount;
  readonly amount: number;
}

export class AccountDomainService {
  remit({ account, receiver, amount }: RemittanceOptions): void {
    account.withdraw(amount);
    receiver.deposit(amount);
  }
}
