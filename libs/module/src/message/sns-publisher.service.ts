import {
  CreateTopicCommand,
  PublishCommand,
  SNSClient,
} from '@aws-sdk/client-sns';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Topic } from './message.enum';
import { Message } from './message.interface';

@Injectable()
export class SNSPublisherService {
  constructor(private configService: ConfigService) {}
  private readonly snsClient = new SNSClient({
    region: this.configService.get('AWS_REGION'),
    endpoint: this.configService.get('AWS_ENDPOINT'),
    credentials: {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    },
  });
  private logger = new Logger(SNSPublisherService.name);

  async publish(topicName: Topic, message: Message): Promise<void> {
    const topicArn = (
      await this.snsClient.send(new CreateTopicCommand({ Name: topicName }))
    ).TopicArn;

    await this.snsClient.send(
      new PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify(message),
      }),
    );

    this.logger.log(
      `Message published. Message: ${JSON.stringify({ topicName, message })}`,
    );
  }
}
