import { PasswordModule } from '@app/module/password/password.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

const 
@Module({
  imports: [CqrsModule, PasswordModule],
  controllers: [],
})
export class AccountModule {}
