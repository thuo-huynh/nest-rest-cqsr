export class AccountPasswordUpdated {
  constructor(
    readonly accountId: string,
    readonly email: string,
  ) {}
}
