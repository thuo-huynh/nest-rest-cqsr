import RequestStorage from '@app/common/storages/request-storage';
import { Injectable } from '@nestjs/common';
import { IEvent } from '@nestjs/cqrs';
import { Topic } from './message.enum';
import { IIntegrationEventPublisher } from './message.interface';
import { SNSPublisherService } from './sns-publisher.service';

@Injectable()
export class IntegrationEventPublisherService
  implements IIntegrationEventPublisher
{
  constructor(private readonly snsMessagePublisher: SNSPublisherService) {}

  async publish(name: Topic, body: IEvent): Promise<void> {
    console.log('🚀 ~ publish ~ name:', name);
    await this.snsMessagePublisher.publish(name, {
      name,
      body,
      requestId: RequestStorage.getStorage().requestId,
    });
  }
}
