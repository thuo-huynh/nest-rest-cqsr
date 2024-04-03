import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseService } from './database.service';
import { EntityIdTransformerService } from './transformer.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DatabaseService, EntityIdTransformerService],
  exports: [EntityIdTransformerService],
})
export class DatabaseModule {}
