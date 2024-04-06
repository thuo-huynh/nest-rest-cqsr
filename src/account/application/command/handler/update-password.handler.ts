import { IPasswordGenerator } from '@app/module/password/password.interface';
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IAccountRepository } from 'src/account/domain/account.interface';
import { ErrorMessage } from 'src/account/domain/account.message';
import { UpdatePasswordCommand } from '../update-password.command';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler
  implements ICommandHandler<UpdatePasswordCommand, void>
{
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly passwordGenerator: IPasswordGenerator,
  ) {}
  async execute(command: UpdatePasswordCommand): Promise<void> {
    const account = await this.accountRepository.findById(command.accountId);
    if (!account)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    account.updatePassword(
      this.passwordGenerator.generateKey(command.password),
    );

    await this.accountRepository.save(account);

    account.commit();
  }
}
