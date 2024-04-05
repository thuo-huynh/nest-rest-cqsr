import { EntityId } from '@app/module/database/database.service';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length } from 'class-validator';

export class FindAccountByIdRequestParam {
  @IsAlphanumeric()
  @Length(32, 32)
  @ApiProperty({ example: new EntityId().toString() })
  readonly accountId: string;
}
