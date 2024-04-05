import { PasswordGeneratorService } from '@app/module/password/password.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AccountFactory } from 'src/account/domain/account.factory';
import { OpenAccountCommand } from '../open-account.command';
import { AccountRepository } from 'src/account/infrastructure/repository/account.repository';

@CommandHandler(OpenAccountCommand)
export class OpenAccountHandler
  implements ICommandHandler<OpenAccountCommand, void>
{
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly accountFactory: AccountFactory,
    private readonly passwordGenerator: PasswordGeneratorService,
  ) {}

  async execute(command: OpenAccountCommand): Promise<void> {
    const account = this.accountFactory.create({
      ...command,
      id: await this.accountRepository.newId(),
      password: this.passwordGenerator.generateKey(command.password),
    });
    console.log(
      '🚀 ~ execute ~ await this.accountRepository.newId():',
      await this.accountRepository.newId(),
    );

    console.log('🚀 ~ execute ~ account:', account);

    // Emit event open account
    account.open();

    await this.accountRepository.save(account);

    account.commit();
  }
}
