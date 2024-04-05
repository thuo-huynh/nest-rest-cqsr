export type AccountEssentialProperties = Readonly<
  Required<{
    id: string;
    name: string;
    email: string;
  }>
>;

export type AccountOptionalProperties = Readonly<
  Partial<{
    password: string;
    balance: number;
    lockedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    version: number;
  }>
>;

export type AccountProperties = AccountEssentialProperties &
  Required<AccountOptionalProperties>;

export type CreateAccountOptions = Readonly<{
  id: string;
  name: string;
  email: string;
  password: string;
}>;
