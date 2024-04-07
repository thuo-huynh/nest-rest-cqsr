import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LockAccountCommand } from '../lock-account.command';
import { AccountRepository } from 'src/account/infrastructure/repository/account.repository';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessage } from 'src/account/domain/account.message';

@CommandHandler(LockAccountCommand)
export class LockAccountHandler
  implements ICommandHandler<LockAccountCommand, void>
{
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(command: LockAccountCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.accountId);
    if (!account)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.lock();

    await this.accountRepository.save(account);

    account.commit();
  }
}
