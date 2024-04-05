export interface IAccount {
  compareId: (id: string) => boolean;
  open: () => void;
  updatePassword: (password: string) => void;
  withdraw: (amount: number) => void;
  deposit: (amount: number) => void;
  close: () => void;
  lock: () => void;
  commit: () => void;
}

export interface IAccountRepository {
  newId: () => Promise<string>;
  save: (account: IAccount | IAccount[]) => Promise<void>;
  findById: (id: string) => Promise<IAccount | null>;
  findByName: (name: string) => Promise<IAccount[]>;
}
