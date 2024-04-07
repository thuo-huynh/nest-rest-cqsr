export class AccountClosed {
  constructor(
    readonly accountId: string,
    readonly email: string,
  ) {}
}
