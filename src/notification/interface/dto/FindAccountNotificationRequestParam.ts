import { EntityId } from '@app/module/database/database.service';
import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, Length } from 'class-validator';

export class FindAccountNotificationRequestParam {
  @ApiProperty({ example: new EntityId() })
  @IsAlphanumeric()
  @Length(32, 32)
  readonly accountId: string;
}
