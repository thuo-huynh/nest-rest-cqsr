import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message } from './message.interface';

@Injectable()
export class SQSPublisherService {
  constructor(private configService: ConfigService) {}
  private readonly sqsClient = new SQSClient({
    region: this.configService.get('AWS_REGION'),
    endpoint: this.configService.get('AWS_ENDPOINT'),
  });
  private readonly logger = new Logger(SQSPublisherService.name);

  async publish(message: Message): Promise<void> {
    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: this.configService.get('AWS_SQS_QUEUE_URL'),
        MessageBody: JSON.stringify(message),
        DelaySeconds: Math.round(Math.random() * 10),
      }),
    );
    this.logger.log(`Message published. Message: ${JSON.stringify(message)}`);
  }
}
