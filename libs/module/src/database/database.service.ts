import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountEntity } from 'src/account/infrastructure/entity/AccountEntity';
import { NotificationEntity } from 'src/notification/infrastructure/entity/NotificationEntity';
import { DataSource } from 'typeorm';
import { v4 } from 'uuid';
import { ReadConnection, WriteConnection } from './database.interface';

export let writeConnection = {} as WriteConnection;
export let readConnection = {} as ReadConnection;

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {}
  private readonly dataSource = new DataSource({
    type: 'mysql',
    entities: [AccountEntity, NotificationEntity],
    charset: 'utf8mb4_unicode_ci',
    logging: this.configService.get('DATABASE_LOGGING'),
    host: this.configService.get('DATABASE_HOST'),
    port: this.configService.get('DATABASE_PORT'),
    database: this.configService.get('DATABASE_NAME'),
    username: this.configService.get('DATABASE_USER'),
    password: this.configService.get('DATABASE_PASSWORD'),
    synchronize: this.configService.get('DATABASE_SYNC'),
  });

  async onModuleInit(): Promise<void> {
    await this.dataSource.initialize();
    if (!this.dataSource.isInitialized)
      throw new Error('DataSource is not initialized');
    writeConnection = this.dataSource.createQueryRunner();
    readConnection = this.dataSource.manager;
  }

  async onModuleDestroy(): Promise<void> {
    await this.dataSource.destroy();
  }
}

export class EntityId extends String {
  constructor() {
    super(v4().split('-').join(''));
  }
}
