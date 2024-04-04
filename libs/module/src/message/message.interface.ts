import { IEvent } from '@nestjs/cqrs';
import { Topic } from './message.enum';

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
