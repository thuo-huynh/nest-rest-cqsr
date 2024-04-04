import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '../configs/config.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DiscoveryModule } from '@nestjs-plus/discovery';
import { SNSPublisherService } from './sns-publisher.service';
import { SQSPublisherService } from './sqs-publisher.service';
import { SQSConsumerService } from './sqs-consumer.service';
import { TaskPublisherService } from './task-publisher.service';
import { IntegrationEventPublisherService } from './intergration-event-publisher.service';

@Global()
@Module({
  imports: [DiscoveryModule, ConfigModule, ScheduleModule.forRoot()],
  providers: [
    SNSPublisherService,
    SQSConsumerService,
    SQSPublisherService,
    TaskPublisherService,
    IntegrationEventPublisherService,
  ],
  exports: [TaskPublisherService, IntegrationEventPublisherService],
})
export class MessageModule {}
