import { PasswordModule } from '@app/module/password/password.module';
import { PasswordGeneratorService } from '@app/module/password/password.service';
import { Inject, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CloseAccountHandler } from './application/command/handler/close-account.handler';
import { DepositHandler } from './application/command/handler/deposit.handler';
import { LockAccountHandler } from './application/command/handler/lock-account.handler';
import { OpenAccountHandler } from './application/command/handler/open-account.handler';
import { RemitHandler } from './application/command/handler/remit.handler';
import { UpdatePasswordHandler } from './application/command/handler/update-password.handler';
import { WithdrawHandler } from './application/command/handler/withdraw.handler';
import { FindAccountByIdHandler } from './application/query/handler/find-account-by-id.handler';
import { FindAccountHandler } from './application/query/handler/find-account.handler';
import { AccountDomainService } from './domain/account-domain.service';
import { AccountFactory } from './domain/account.factory';
import { AccountQuery } from './infrastructure/query/account.query';
import { AccountRepository } from './infrastructure/repository/account.repository';
import { AccountController } from './interface/account.troller';

import { EntityIdTransformer } from '@app/module/database/database.interface';
import { writeConnection } from '@app/module/database/database.service';
import { EntityIdTransformerService } from '@app/module/database/transformer.service';
import { ITaskPublisher } from '@app/module/message/message.interface';
import { TaskPublisherService } from '@app/module/message/task-publisher.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { addYears } from 'date-fns';
import { LessThan } from 'typeorm';
import { LockAccountCommand } from './application/command/lock-account.command';
import { AccountClosedEventHandler } from './application/event/handler/account-closed.handler';
import { AccountOpenedEventHandler } from './application/event/handler/account-opened.handler';
import { DepositedEventHandler } from './application/event/handler/deposit.handler';
import { PasswordUpdatedEventHandler } from './application/event/handler/password-update.handler';
import { WithdrawnEventHandler } from './application/event/handler/withdrawn.handler';
import { AccountEntity } from './infrastructure/entity/AccountEntity';
const infrastructure: Provider[] = [AccountRepository, AccountQuery];

const application = [
  // Commands
  OpenAccountHandler,
  CloseAccountHandler,
  DepositHandler,
  LockAccountHandler,
  RemitHandler,
  UpdatePasswordHandler,
  WithdrawHandler,

  // Events
  AccountClosedEventHandler,
  AccountOpenedEventHandler,
  DepositedEventHandler,
  PasswordUpdatedEventHandler,
  WithdrawnEventHandler,

  // Queries
  FindAccountHandler,
  FindAccountByIdHandler,
];

const domain = [AccountFactory, AccountDomainService, PasswordGeneratorService];
@Module({
  imports: [CqrsModule, PasswordModule],
  controllers: [AccountController],
  providers: [...domain, ...infrastructure, ...application],
})
export class AccountModule {
  constructor(
    @Inject(TaskPublisherService)
    private readonly taskPublisher: ITaskPublisher,
    @Inject(EntityIdTransformerService)
    private readonly entityIdTransformer: EntityIdTransformer,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async lockUnusedAccount(): Promise<void> {
    (
      await writeConnection.manager
        .getRepository(AccountEntity)
        .findBy({ updatedAt: LessThan(addYears(new Date(), -1)) })
    ).forEach((account) =>
      this.taskPublisher.publish(
        LockAccountCommand.name,
        new LockAccountCommand(this.entityIdTransformer.from(account.id)),
      ),
    );
  }
}
