import { PasswordGeneratorService } from '@app/module/password/password.service';
import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ErrorMessage } from 'src/account/domain/account.message';
import { AccountRepository } from 'src/account/infrastructure/repository/account.repository';
import { UpdatePasswordCommand } from '../update-password.command';
import { IAccountRepository } from 'src/account/domain/account.interface';
import { IPasswordGenerator } from '@app/module/password/password.interface';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler
  implements ICommandHandler<UpdatePasswordCommand, void>
{
  constructor(
    @Inject(AccountRepository)
    private readonly accountRepository: IAccountRepository,
    @Inject(PasswordGeneratorService)
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
