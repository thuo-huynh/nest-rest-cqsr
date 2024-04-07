import { IEvent } from '@nestjs/cqrs';
import { Topic } from './message.enum';
import { SetMetadata } from '@nestjs/common';

export type Message = Readonly<{
  name: string;
  body: IEvent;
  requestId: string;
}>;
export type MessageHandlerMetadata = Readonly<{ name: string }>;

export interface ITaskPublisher {
  publish: (name: string, task: IEvent) => Promise<void>;
}

export interface IIntegrationEventPublisher {
  publish: (name: Topic, body: IEvent) => Promise<void>;
}

const SQS_CONSUMER_METHOD = Symbol.for('SQS_CONSUMER_METHOD');
export const MessageHandler = (name: string) =>
  SetMetadata<symbol, MessageHandlerMetadata>(SQS_CONSUMER_METHOD, { name });
