import { PasswordModule } from '@app/module/password/password.module';
import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountQuery } from './infrastructure/query/account.query';
import { AccountRepository } from './infrastructure/repository/account.repository';
import { AccountController } from './interface/account.troller';
import { OpenAccountHandler } from './application/command/handler/open-account.handler';
import { AccountFactory } from './domain/account.factory';
import { AccountDomainService } from './domain/account-domain.service';
import { PasswordGeneratorService } from '@app/module/password/password.service';
import { FindAccountHandler } from './application/query/handler/find-account.handler';

const infrastructure: Provider[] = [AccountRepository, AccountQuery];

const application = [OpenAccountHandler, FindAccountHandler];

const domain = [AccountFactory, AccountDomainService, PasswordGeneratorService];
@Module({
  imports: [CqrsModule, PasswordModule],
  controllers: [AccountController],
  providers: [...infrastructure, ...application, ...domain],
})
export class AccountModule {}
