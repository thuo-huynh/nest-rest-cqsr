import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ErrorMessage } from 'src/account/domain/account.message';
import { AccountRepository } from 'src/account/infrastructure/repository/account.repository';
import { WithdrawCommand } from '../withdraw.command';

@CommandHandler(WithdrawCommand)
export class WithdrawHandler implements ICommandHandler<WithdrawCommand, void> {
  constructor(private readonly accountRepository: AccountRepository) {}

  //   @Transactional()
  async execute(command: WithdrawCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.accountId);
    if (!account)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    account.withdraw(command.amount);

    await this.accountRepository.save(account);

    account.commit();
  }
}
