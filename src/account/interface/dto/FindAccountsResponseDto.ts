import { ApiProperty } from '@nestjs/swagger';

import { EntityId } from '@app/module/database/database.service';
import { FindAccountsResult } from 'src/account/application/query/result/find-account-result';

class Account {
  @ApiProperty({ example: new EntityId() })
  readonly id: string;

  @ApiProperty({ example: 'young' })
  readonly name: string;

  @ApiProperty({ example: 100 })
  readonly balance: number;
}

export class FindAccountsResponseDto extends FindAccountsResult {
  @ApiProperty({ type: [Account] })
  readonly accounts: Account[];
}
