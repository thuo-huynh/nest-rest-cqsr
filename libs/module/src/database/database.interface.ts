import { EntityManager } from 'typeorm';

export interface WriteConnection {
  readonly startTransaction: (
    level?:
      | 'READ UNCOMMITTED'
      | 'READ COMMITTED'
      | 'REPEATABLE READ'
      | 'SERIALIZABLE',
  ) => Promise<void>;
  readonly commitTransaction: () => Promise<void>;
  readonly rollbackTransaction: () => Promise<void>;
  readonly isTransactionActive: boolean;
  readonly manager: EntityManager;
}

export interface ReadConnection {
  readonly getRepository;
}

export interface EntityIdTransformer {
  from: (dbData: Buffer) => string;
  to: (stringId: string) => Buffer;
}
