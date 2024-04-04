import { Inject, Injectable } from '@nestjs/common';
import { IIntegrationEventPublisher } from './message.interface';
import { SNSPublisherService } from './sns-publisher.service';
import { Topic } from './message.enum';
import { IEvent } from '@nestjs/cqrs';
import RequestStorage from '@app/common/storages/request-storage';

@Injectable()
export class IntegrationEventPublisherService
  implements IIntegrationEventPublisher
{
  constructor(
    @Inject() private readonly snsMessagePublisher: SNSPublisherService,
  ) {}

  async publish(name: Topic, body: IEvent): Promise<void> {
    await this.snsMessagePublisher.publish(name, {
      name,
      body,
      requestId: RequestStorage.getStorage().requestId,
    });
  }
}
