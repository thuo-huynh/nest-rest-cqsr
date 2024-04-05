import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DepositCommand } from '../deposit.command';
import { AccountRepository } from 'src/account/infrastructure/repository/account.repository';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessage } from 'src/account/domain/account.message';

@CommandHandler(DepositCommand)
export class DepositHandler implements ICommandHandler<DepositCommand, void> {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(command: DepositCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.accountId);
    if (!account)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.deposit(command.amount);

    await this.accountRepository.save(account);

    account.commit();
  }
}
