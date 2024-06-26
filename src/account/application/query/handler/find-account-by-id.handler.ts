import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAccountByIdResult } from '../result/find-account-by-id-result';
import { AccountQuery } from 'src/account/infrastructure/query/account.query';
import { FindAccountByIdQuery } from '../find-account-by-id.query';
import { ErrorMessage } from 'src/account/domain/account.message';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@QueryHandler(FindAccountByIdQuery)
export class FindAccountByIdHandler
  implements IQueryHandler<FindAccountByIdQuery, FindAccountByIdResult>
{
  constructor(private readonly accountQuery: AccountQuery) {}
  async execute(query: FindAccountByIdQuery): Promise<FindAccountByIdResult> {
    const data = await this.accountQuery.findById(query.id);
    if (!data) throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);

    const dataKeys = Object.keys(data);
    const resultKeys = Object.keys(new FindAccountByIdResult());

    if (dataKeys.length < resultKeys.length)
      throw new InternalServerErrorException();

    if (resultKeys.find((resultKey) => !dataKeys.includes(resultKey)))
      throw new InternalServerErrorException();

    dataKeys
      .filter((dataKey) => !resultKeys.includes(dataKey))
      .forEach((dataKey) => delete data[dataKey]);

    return data;
  }
}
