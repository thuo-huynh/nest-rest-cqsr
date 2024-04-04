import RequestStorage from '@app/common/storages/request-storage';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { DiscoveryService } from '@nestjs-plus/discovery';
import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModulesContainer } from '@nestjs/core';
import { IEvent } from '@nestjs/cqrs';
import { Interval } from '@nestjs/schedule';
import { Message, MessageHandlerMetadata } from './message.interface';

const SQS_CONSUMER_METHOD = Symbol.for('SQS_CONSUMER_METHOD');

@Injectable()
export class SQSConsumerService implements OnModuleDestroy {
  constructor(private configService: ConfigService) {}
  private readonly logger = new Logger(SQSConsumerService.name);
  @Inject() private readonly discover: DiscoveryService;
  @Inject() private readonly modulesContainer: ModulesContainer;
  private readonly sqsClient = new SQSClient({
    region: this.configService.get('AWS_REGION'),
    endpoint: this.configService.get('AWS_ENDPOINT'),
    credentials: {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    },
  });

  @Interval(5000)
  async handleMessage(): Promise<void> {
    let parsedMessage: Message;
    try {
      RequestStorage.reset();
      const {
        Messages: [message],
      } = await this.sqsClient.send(
        new ReceiveMessageCommand({
          QueueUrl: this.configService.get('AWS_SQS_QUEUE_URL'),
          AttributeNames: ['All'],
          MessageAttributeNames: ['All'],
          MaxNumberOfMessages: 1,
        }),
      );

      // Skip if no message or invalid body
      if (!message || !message.Body) return;

      // Parse message body
      parsedMessage = JSON.parse(message.Body);

      // Find message handler and controller
      const handler = (
        await this.discover.controllerMethodsWithMetaAtKey<MessageHandlerMetadata>(
          SQS_CONSUMER_METHOD,
        )
      ).find((h) => h.meta.name === parsedMessage.name);

      if (!handler) {
        throw new Error(
          `Message handler not found: ${JSON.stringify(parsedMessage)}`,
        );
      }
      const controller = Array.from(this.modulesContainer.values())
        .flatMap((m) => Array.from(m.controllers.values()))
        .find((c) => c.name === handler.discoveredMethod.parentClass.name);
      if (!controller) {
        throw new Error(
          `Message handling controller not found: ${JSON.stringify(parsedMessage)}`,
        );
      }

      // Handle message and delete from queue
      await handler.discoveredMethod.handler.bind(controller.instance)(
        parsedMessage.body,
      );
      await this.sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: this.configService.get('AWS_SQS_QUEUE_URL'),
          ReceiptHandle: message.ReceiptHandle,
        }),
      );

      this.logger.log(
        `Message handling completed: ${JSON.stringify(parsedMessage)}`,
      );
    } catch (error) {
      this.logger.error(
        `Message handling error: ${JSON.stringify(parsedMessage)} - ${error}`,
      );
    }
  }

  onModuleDestroy(): void {
    this.sqsClient.destroy();
  }
}
