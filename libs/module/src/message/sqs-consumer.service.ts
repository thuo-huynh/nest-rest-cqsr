import RequestStorage from '@app/common/storages/request-storage';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModulesContainer } from '@nestjs/core';
import { Interval } from '@nestjs/schedule';
import { Message, MessageHandlerMetadata } from './message.interface';
import { DiscoveryService } from '@golevelup/nestjs-discovery';

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

  // @Interval(5000)
  // async handleMessage(): Promise<void> {
  //   let parsedMessage: Message;
  //   try {
  //     RequestStorage.reset();
  //     const {
  //       Messages: [message],
  //     } = await this.sqsClient.send(
  //       new ReceiveMessageCommand({
  //         QueueUrl: this.configService.get('AWS_SQS_QUEUE_URL'),
  //         AttributeNames: ['All'],
  //         MessageAttributeNames: ['All'],
  //         MaxNumberOfMessages: 1,
  //       }),
  //     );

  //     // Skip if no message or invalid body
  //     if (!message || !message.Body) return;

  //     // Parse message body
  //     parsedMessage = JSON.parse(message.Body);

  //     // Find message handler and controller
  //     const handler = (
  //       await this.discover.controllerMethodsWithMetaAtKey<MessageHandlerMetadata>(
  //         SQS_CONSUMER_METHOD,
  //       )
  //     ).find((h) => h.meta.name === parsedMessage.name);

  //     if (!handler) {
  //       throw new Error(
  //         `Message handler not found: ${JSON.stringify(parsedMessage)}`,
  //       );
  //     }
  //     const controller = Array.from(this.modulesContainer.values())
  //       .flatMap((m) => Array.from(m.controllers.values()))
  //       .find((c) => c.name === handler.discoveredMethod.parentClass.name);
  //     if (!controller) {
  //       throw new Error(
  //         `Message handling controller not found: ${JSON.stringify(parsedMessage)}`,
  //       );
  //     }

  //     // Handle message and delete from queue
  //     await handler.discoveredMethod.handler.bind(controller.instance)(
  //       parsedMessage.body,
  //     );
  //     await this.sqsClient.send(
  //       new DeleteMessageCommand({
  //         QueueUrl: this.configService.get('AWS_SQS_QUEUE_URL'),
  //         ReceiptHandle: message.ReceiptHandle,
  //       }),
  //     );

  //     this.logger.log(
  //       `Message handling completed: ${JSON.stringify(parsedMessage)}`,
  //     );
  //   } catch (error) {
  //     this.logger.error(
  //       `Message handling error: ${JSON.stringify(parsedMessage)} - ${error}`,
  //     );
  //   }
  // }

  @Interval(5000)
  async handleMessage(): Promise<void> {
    RequestStorage.reset();
    const response = (
      await this.sqsClient.send(
        new ReceiveMessageCommand({
          QueueUrl: this.configService.get('AWS_SQS_QUEUE_URL'),
          AttributeNames: ['All'],
          MessageAttributeNames: ['All'],
          MaxNumberOfMessages: 1,
        }),
      )
    ).Messages;
    console.log(
      '🚀 ~ SQSConsumerService ~ handleMessage ~ response:',
      response,
    );
    if (!response || !response[0] || !response[0].Body) return;

    const message = (
      (JSON.parse(response[0].Body) as { Message?: string }).Message
        ? JSON.parse(
            (JSON.parse(response[0].Body) as { Message: string }).Message,
          )
        : JSON.parse(response[0].Body)
    ) as Message;
    console.log('🚀 ~ SQSConsumerService ~ handleMessage ~ message:', message);
    RequestStorage.setRequestId(message.requestId);

    const handler = (
      await this.discover.controllerMethodsWithMetaAtKey<MessageHandlerMetadata>(
        SQS_CONSUMER_METHOD,
      )
    ).find((handler) => handler.meta.name === message.name);
    if (!handler)
      throw new Error(
        `Message handler is not found. Message: ${JSON.stringify(message)}`,
      );

    const controller = Array.from(this.modulesContainer.values())
      .filter((module) => 0 < module.controllers.size)
      .flatMap((module) => Array.from(module.controllers.values()))
      .find(
        (wrapper) => wrapper.name == handler.discoveredMethod.parentClass.name,
      );
    if (!controller)
      throw new Error(
        `Message handling controller is not found. Message: ${JSON.stringify(
          message,
        )}`,
      );

    try {
      await handler.discoveredMethod.handler.bind(controller.instance)(
        message.body,
      );
      await this.sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: this.configService.get('AWS_SQS_QUEUE_URL'),
          ReceiptHandle: response[0].ReceiptHandle,
        }),
      );
    } catch (error) {
      return this.logger.error(
        `Message handling error. Message: ${JSON.stringify(
          message,
        )}. Error: ${error}`,
      );
    }
    this.logger.log(
      `Message handling completed. Message: ${JSON.stringify(message)}`,
    );
  }

  onModuleDestroy(): void {
    this.sqsClient.destroy();
  }
}
