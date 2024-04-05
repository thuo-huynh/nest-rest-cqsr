import {
  EntityId,
  writeConnection,
} from '@app/module/database/database.service';
import { EntityIdTransformerService } from '@app/module/database/transformer.service';
import { Account } from 'src/account/domain/account';
import { AccountFactory } from 'src/account/domain/account.factory';
import { IAccountRepository } from 'src/account/domain/account.interface';
import { AccountProperties } from 'src/account/domain/account.type';
import { AccountEntity } from '../entity/AccountEntity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    private readonly accountFactory: AccountFactory,
    private readonly entityIdTransformer: EntityIdTransformerService,
  ) {}

  async newId(): Promise<string> {
    return new EntityId().toString();
  }

  async save(data: Account | Account[]) {
    const models = Array.isArray(data) ? data : [data];
    const entities = models.map((model) => this.modelToEntity(model));
    await writeConnection.manager.getRepository(AccountEntity).save(entities);
  }

  async findById(id: string): Promise<Account | null> {
    const entity = await writeConnection.manager
      .getRepository(AccountEntity)
      .findOneBy({ id: this.entityIdTransformer.to(id) });
    return entity ? this.entityToModel(entity) : null;
  }

  async findByName(name: string): Promise<Account[]> {
    const entities = await writeConnection.manager
      .getRepository(AccountEntity)
      .findBy({ name });
    return entities.map((entity) => this.entityToModel(entity));
  }

  private modelToEntity(model: Account): AccountEntity {
    const properties = JSON.parse(JSON.stringify(model)) as AccountProperties;
    console.log(
      '🚀 ~ AccountRepository ~ modelToEntity ~ this.entityIdTransformer.to(properties.id):',
      this.entityIdTransformer.to(properties.id),
    );
    return {
      ...properties,
      id: this.entityIdTransformer.to(properties.id),
      createdAt: properties.createdAt,
      deletedAt: properties.deletedAt,
    };
  }

  private entityToModel(entity: AccountEntity): Account {
    return this.accountFactory.reconstitute({
      ...entity,
      id: this.entityIdTransformer.from(entity.id),
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
    });
  }
}
