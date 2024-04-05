import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CloseAccountCommand } from '../close-account.command';
import { AccountRepository } from 'src/account/infrastructure/repository/account.repository';
import { NotFoundException } from '@nestjs/common';
import { ErrorMessage } from 'src/account/domain/account.message';

@CommandHandler(CloseAccountCommand)
export class CloseAccountHandler
  implements ICommandHandler<CloseAccountCommand, void>
{
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(command: CloseAccountCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.accountId);
    if (!account)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.close();

    await this.accountRepository.save(account);

    account.commit();
  }
}
