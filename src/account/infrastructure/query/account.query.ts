import { readConnection } from '@app/module/database/database.service';
import { EntityIdTransformerService } from '@app/module/database/transformer.service';
import { Injectable } from '@nestjs/common';
import { FindAccountByIdResult } from 'src/account/application/query/find-account-by-id-result';
import { FindAccountsQuery } from 'src/account/application/query/find-account.query';
import { FindAccountsResult } from 'src/account/application/query/find-account-result';
import { IAccountQuery } from 'src/account/domain/account.interface';
import { AccountEntity } from '../entity/AccountEntity';

@Injectable()
export class AccountQuery implements IAccountQuery {
  constructor(
    private readonly entityIdTransformer: EntityIdTransformerService,
  ) {}

  async find(query: FindAccountsQuery): Promise<FindAccountsResult> {
    return readConnection
      .getRepository(AccountEntity)
      .find({
        skip: query.skip,
        take: query.take,
      })
      .then((entities) => ({
        accounts: entities.map((entity) => ({
          id: this.entityIdTransformer.from(entity.id),
          name: entity.name,
          balance: entity.balance,
        })),
      }));
  }
  async findById(id: string): Promise<FindAccountByIdResult | null> {
    return;
  }
}
