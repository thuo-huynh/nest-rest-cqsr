import { Injectable } from '@nestjs/common';
import { EntityIdTransformer } from './database.interface';

@Injectable()
export class EntityIdTransformerService implements EntityIdTransformer {
  from(dbData: Buffer): string {
    return Buffer.from(dbData.toString('binary'), 'ascii').toString('hex');
  }

  to(entityData: string): Buffer {
    return Buffer.from(entityData, 'hex');
  }
}
