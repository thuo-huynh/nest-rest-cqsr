import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemitCommand } from '../remit.command';
import { AccountRepository } from 'src/account/infrastructure/repository/account.repository';
import { AccountDomainService } from 'src/account/domain/account-domain.service';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ErrorMessage } from 'src/account/domain/account.message';

@CommandHandler(RemitCommand)
export class RemitHandler implements ICommandHandler<RemitCommand, void> {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly accountDomainService: AccountDomainService,
  ) {}
  async execute(command: RemitCommand): Promise<void> {
    if (command.accountId === command.receiverId)
      throw new UnprocessableEntityException(
        ErrorMessage.WITHDRAWAL_AND_DEPOSIT_ACCOUNTS_CANNOT_BE_THE_SAME,
      );

    const account = await this.accountRepository.findById(command.accountId);
    if (!account)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    const receiver = await this.accountRepository.findById(command.receiverId);
    if (!receiver)
      throw new UnprocessableEntityException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    this.accountDomainService.remit({ ...command, account, receiver });

    await this.accountRepository.save([account, receiver]);

    account.commit();
    receiver.commit();
  }
}
