import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { NotificationModule } from './notification/notification.module';
import { ConfigModule } from '@app/module/configs/config.module';

@Module({
  imports: [AccountModule, NotificationModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
