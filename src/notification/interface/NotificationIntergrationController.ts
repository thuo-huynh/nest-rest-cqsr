import { Topic } from '@app/module/message/message.enum';
import { MessageHandler } from '@app/module/message/message.interface';
import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Controller()
export class NotificationIntegrationController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessageHandler(Topic.ACCOUNT_OPENED)
  async sendNewAccountEmail() {}
}
