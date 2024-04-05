import { ConfigModule } from '@app/module/configs/config.module';
import { DatabaseModule } from '@app/module/database/database.module';
import { MessageModule } from '@app/module/message/message.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AccountModule } from './account/account.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RequestStorageMiddleware } from '@app/common/middlewares/request-storage.middleware';

@Module({
  imports: [
    AccountModule,
    NotificationModule,
    DatabaseModule,
    ConfigModule,
    MessageModule,
    ThrottlerModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStorageMiddleware).forRoutes('*');
  }
}
