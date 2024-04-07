import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

@Injectable()
export class NotificationFactory {
  constructor(private readonly eventPublisher: EventPublisher) {}
  create() {}
  reconstitute() {}
}
