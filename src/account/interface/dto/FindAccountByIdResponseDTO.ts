import { EntityId } from '@app/module/database/database.service';
import { ApiProperty } from '@nestjs/swagger';
import { FindAccountByIdResult } from 'src/account/application/query/result/find-account-by-id-result';

export class FindAccountByIdResponseDTO extends FindAccountByIdResult {
  @ApiProperty({ example: new EntityId() })
  readonly id: string;

  @ApiProperty({ example: 'young' })
  readonly name: string;

  @ApiProperty({ example: 100 })
  readonly balance: number;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly updatedAt: Date;

  @ApiProperty({ nullable: true, example: null })
  readonly deletedAt: Date | null;
}
