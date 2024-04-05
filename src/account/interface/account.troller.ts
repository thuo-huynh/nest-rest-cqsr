import { Body, Controller } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { OpenAccountRequestDTO } from './dto/OpenAccountRequestDTO';

@ApiTags('Accounts')
@Controller()
export class AccountController {
  constructor(
    readonly commandBus: CommandBus,
    readonly queryBus: QueryBus,
  ) {}

  async openAccount(@Body() body: OpenAccountRequestDTO): Promise<void> {
    const command = new OpenAccount();
  }
}
