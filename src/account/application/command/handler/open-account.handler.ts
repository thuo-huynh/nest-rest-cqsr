import { PasswordGeneratorService } from '@app/module/password/password.service';
import { ICommandHandler } from '@nestjs/cqrs';
import { AccountFactory } from 'src/account/domain/account.factory';
import { AccountRepository } from 'src/account/domain/account.repository';
import { OpenAccountCommand } from '../open-account.command';

export class OpenAccountHandler
  implements ICommandHandler<OpenAccountCommand, void>
{
  private readonly accountRepository: AccountRepository;
  private readonly accountFactory: AccountFactory;
  private readonly passwordGenerator: PasswordGeneratorService;

  async execute(command: OpenAccountCommand): Promise<void> {
    const account = this.accountFactory.create({
      ...command,
      id: await this.accountRepository.newId(),
      password: this.passwordGenerator.generateKey(command.password),
    });

    // Emit event open account
    account.open();

    await this.accountRepository.save(account);

    account.commit();
  }
}
