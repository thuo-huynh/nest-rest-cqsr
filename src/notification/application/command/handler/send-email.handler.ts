import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationFactory } from 'src/notification/domain/notification.factory';
import { INotificationRepository } from 'src/notification/domain/notification.interface';
import { IEmailAdaptor } from '../../adaptor/email-adaptor.interface';
import { SendEmailCommand } from '../send-email.command';
import { Inject } from '@nestjs/common';
import { EmailAdaptor } from 'src/notification/infrastructure/adaptor/email.adaptor';
import { NotificationRepository } from 'src/notification/infrastructure/repository/notification.repository';

@CommandHandler(SendEmailCommand)
export class SendMailHandler
  implements ICommandHandler<SendEmailCommand, void>
{
  constructor(
    private readonly notificationFactory: NotificationFactory,
    @Inject(NotificationRepository)
    private readonly notificationRepository: INotificationRepository,
    @Inject(EmailAdaptor)
    private readonly emailAdaptor: IEmailAdaptor,
  ) {}

  async execute(command: SendEmailCommand): Promise<void> {
    const notification = await this.notificationFactory.create({
      ...command,
      id: this.notificationRepository.newId(),
    });
    await this.notificationRepository.save(notification);
    await this.emailAdaptor.sendEmail(
      command.to,
      command.subject,
      command.content,
    );
  }
}
