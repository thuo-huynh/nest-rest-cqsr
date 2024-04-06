import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAccountsQuery } from '../find-account.query';
import { FindAccountsResult } from '../result/find-account-result';
import { AccountQuery } from 'src/account/infrastructure/query/account.query';

@QueryHandler(FindAccountsQuery)
export class FindAccountHandler
  implements IQueryHandler<FindAccountsQuery, FindAccountsResult>
{
  constructor(readonly accountQuery: AccountQuery) {}

  async execute(query: FindAccountsQuery): Promise<FindAccountsResult> {
    return this.accountQuery.find(query);
  }
}
