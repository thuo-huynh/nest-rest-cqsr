import requestStorage from '@app/common/storages/request-storage';
import { Injectable } from '@nestjs/common';
import { IEvent } from '@nestjs/cqrs';
import { ITaskPublisher } from './message.interface';
import { SQSPublisherService } from './sqs-publisher.service';

@Injectable()
export class TaskPublisherService implements ITaskPublisher {
  constructor(private readonly sqsMessagePublisher: SQSPublisherService) {}
  async publish(name: string, body: IEvent): Promise<void> {
    await this.sqsMessagePublisher.publish({
      name,
      body,
      requestId: requestStorage.getStorage().requestId,
    });
  }
}
