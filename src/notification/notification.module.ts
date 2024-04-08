import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SendMailHandler } from './application/command/handler/send-email.handler';
import { FindNotificationHandler } from './application/query/handler/find-notification.handler';
import { NotificationFactory } from './domain/notification.factory';
import { EmailAdaptor } from './infrastructure/adaptor/email.adaptor';
import { NotificationQuery } from './infrastructure/query/notification.query';
import { NotificationRepository } from './infrastructure/repository/notification.repository';
import { NotificationIntegrationController } from './interface/notification-intergration.controller';
import { NotificationController } from './interface/notification.controller';

const infrastructure = [
  EmailAdaptor,
  NotificationRepository,
  NotificationQuery,
];

const application = [SendMailHandler, FindNotificationHandler];

const domain = [NotificationFactory];
@Module({
  imports: [CqrsModule],
  providers: [...infrastructure, ...application, ...domain],
  controllers: [NotificationIntegrationController, NotificationController],
})
export class NotificationModule {}
