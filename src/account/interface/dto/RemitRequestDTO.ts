import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsAlphanumeric, IsInt, Length, Min } from 'class-validator';

import { EntityId } from '@app/module/database/database.service';

export class RemitRequestDTO {
  @IsAlphanumeric()
  @Length(32, 32)
  @ApiProperty({ example: new EntityId() })
  readonly receiverId: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiProperty({ minimum: 1 })
  readonly amount: number;
}
