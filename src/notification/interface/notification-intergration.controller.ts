import { Topic } from '@app/module/message/message.enum';
import { MessageHandler } from '@app/module/message/message.interface';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AccountOpened } from 'src/account/application/event/account-opened.event';
import { SendEmailCommand } from '../application/command/send-email.command';
import { AccountPasswordUpdated } from 'src/account/application/event/password-update.event';
import { AccountDeposited } from 'src/account/application/event/deposit.event';
import { AccountWithdrawn } from 'src/account/application/event/withdrawn.event';
import { AccountClosed } from 'src/account/application/event/account-closed.event';

@Controller()
export class NotificationIntegrationController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessageHandler(Topic.ACCOUNT_OPENED)
  async sendNewAccountEmail(message: AccountOpened): Promise<void> {
    await this.commandBus.execute<SendEmailCommand, void>(
      new SendEmailCommand({
        accountId: message.accountId,
        to: message.email,
        subject: 'New account created.',
        content: 'New account it opened with this email',
      }),
    );
  }

  @MessageHandler(Topic.ACCOUNT_PASSWORD_UPDATED)
  async sendPasswordUpdatedEmail(
    message: AccountPasswordUpdated,
  ): Promise<void> {
    await this.commandBus.execute<SendEmailCommand, void>(
      new SendEmailCommand({
        accountId: message.accountId,
        to: message.email,
        subject: 'Account password updated',
        content: 'Account password is updated',
      }),
    );
  }

  @MessageHandler(Topic.ACCOUNT_CLOSED)
  async sendAccountClosedEmail(message: AccountClosed): Promise<void> {
    await this.commandBus.execute<SendEmailCommand, void>(
      new SendEmailCommand({
        accountId: message.accountId,
        to: message.email,
        subject: 'Account closed',
        content: 'Account is closed',
      }),
    );
  }

  @MessageHandler(Topic.ACCOUNT_DEPOSITED)
  async sendDepositEmail(message: AccountDeposited): Promise<void> {
    await this.commandBus.execute<SendEmailCommand, void>(
      new SendEmailCommand({
        accountId: message.accountId,
        to: message.email,
        subject: 'Deposited',
        content: 'Deposited into the account',
      }),
    );
  }

  @MessageHandler(Topic.ACCOUNT_WITHDRAWN)
  async sendWithdrawnEmail(message: AccountWithdrawn): Promise<void> {
    await this.commandBus.execute<SendEmailCommand, void>(
      new SendEmailCommand({
        accountId: message.accountId,
        to: message.email,
        subject: 'Withdrawn',
        content: 'It has been withdrawn from your account',
      }),
    );
  }
}
