import { AuthorizedHeader } from '@app/common/guards/authentication';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { DepositCommand } from '../application/command/deposit.command';
import { OpenAccountCommand } from '../application/command/open-account.command';
import { WithdrawCommand } from '../application/command/withdraw.command';
import { FindAccountsQuery } from '../application/query/find-account.query';
import { ErrorMessage } from '../domain/account.message';
import { DepositRequestDto } from './dto/DepositRequestDto';
import { DepositRequestParam } from './dto/DepositRequestParam';
import { FindAccountsRequestQueryString } from './dto/FindAccountsRequestQueryString';
import { FindAccountsResponseDto } from './dto/FindAccountsResponseDto';
import { OpenAccountRequestDTO } from './dto/OpenAccountRequestDTO';
import { WithdrawRequestDTO } from './dto/WithdrawRequestDTO';
import { WithdrawRequestParam } from './dto/WithdrawRequestParam';
import { ResponseDescription } from './response-description';
import { RemitRequestParam } from './dto/RemitRequestParam';
import { RemitRequestDTO } from './dto/RemitRequestDTO';
import { RemitCommand } from '../application/command/remit.command';
import { UpdatePasswordRequestParam } from './dto/UpdatePasswordRequestParam';
import { UpdatePasswordRequestDTO } from './dto/UpdatePasswordRequestDTO';
import { UpdatePasswordCommand } from '../application/command/update-password.command';
import { DeleteAccountRequestParam } from './dto/DeleteAccountRequestParam';
import { CloseAccountCommand } from '../application/command/close-account.command';
import { FindAccountByIdResponseDTO } from './dto/FindAccountByIdResponseDTO';
import { FindAccountByIdRequestParam } from './dto/FindAccountByIdRequestParam';
import { FindAccountByIdQuery } from '../application/query/find-account-by-id.query';

@ApiTags('Accounts')
@Controller()
export class AccountController {
  constructor(
    readonly commandBus: CommandBus,
    readonly queryBus: QueryBus,
  ) {}

  @Post('accounts')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseDescription.CREATED,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async openAccount(@Body() body: OpenAccountRequestDTO): Promise<void> {
    console.log('🚀 ~ AccountController ~ openAccount ~ body:', body);
    const command = new OpenAccountCommand(
      body.name,
      body.email,
      body.password,
    );
    await this.commandBus.execute(command);
  }

  @Post('accounts/:accountId/withdraw')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseDescription.CREATED,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiUnauthorizedResponse({ description: ResponseDescription.UNAUTHORIZED })
  @ApiUnprocessableEntityResponse({
    description: ResponseDescription.UNPROCESSABLE_ENTITY,
  })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async withdraw(
    @Headers() header: AuthorizedHeader,
    @Param() param: WithdrawRequestParam,
    @Body() body: WithdrawRequestDTO,
  ): Promise<void> {
    if (header.accountId !== param.accountId)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    await this.commandBus.execute(
      new WithdrawCommand(param.accountId, body.amount),
    );
  }

  @Post('accounts/:accountId/deposit')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseDescription.CREATED,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async deposit(
    @Headers() header: AuthorizedHeader,
    @Param() param: DepositRequestParam,
    @Body() body: DepositRequestDto,
  ): Promise<void> {
    if (header.accountId !== param.accountId)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    await this.commandBus.execute(
      new DepositCommand(param.accountId, body.amount),
    );
  }

  @Post('accounts/:accountId/remit')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseDescription.CREATED,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiUnauthorizedResponse({ description: ResponseDescription.UNAUTHORIZED })
  @ApiUnprocessableEntityResponse({
    description: ResponseDescription.UNPROCESSABLE_ENTITY,
  })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async remit(
    @Headers() header: AuthorizedHeader,
    @Param() param: RemitRequestParam,
    @Body() body: RemitRequestDTO,
  ): Promise<void> {
    if (header.accountId !== param.accountId)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    await this.commandBus.execute(
      new RemitCommand(param.accountId, body.receiverId, body.amount),
    );
  }

  @Patch('accounts/:accountId/password')
  @ApiResponse({ status: HttpStatus.OK, description: ResponseDescription.OK })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiUnauthorizedResponse({ description: ResponseDescription.UNAUTHORIZED })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async updatePassword(
    @Headers() header: AuthorizedHeader,
    @Param() param: UpdatePasswordRequestParam,
    @Body() body: UpdatePasswordRequestDTO,
  ): Promise<void> {
    if (header.accountId !== param.accountId)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    await this.commandBus.execute(
      new UpdatePasswordCommand(param.accountId, body.password),
    );
  }

  @Delete('accounts/:accountId')
  @ApiResponse({ status: HttpStatus.OK, description: ResponseDescription.OK })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiUnauthorizedResponse({ description: ResponseDescription.UNAUTHORIZED })
  @ApiUnprocessableEntityResponse({
    description: ResponseDescription.UNPROCESSABLE_ENTITY,
  })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async closeAccount(
    @Headers() header: AuthorizedHeader,
    @Param() param: DeleteAccountRequestParam,
  ): Promise<void> {
    if (header.accountId !== param.accountId)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    await this.commandBus.execute(new CloseAccountCommand(param.accountId));
  }

  @Get('accounts')
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseDescription.OK,
    type: FindAccountsResponseDto,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findAccounts(
    @Query() querystring: FindAccountsRequestQueryString,
  ): Promise<FindAccountsResponseDto> {
    const query = new FindAccountsQuery(querystring);
    return { accounts: await this.queryBus.execute(query) };
  }

  @Get('accounts/:accountId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: ResponseDescription.OK,
    type: FindAccountByIdResponseDTO,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  async findAccountById(
    @Headers() header: AuthorizedHeader,
    @Param() param: FindAccountByIdRequestParam,
  ): Promise<FindAccountByIdResponseDTO> {
    if (header.accountId !== param.accountId)
      throw new NotFoundException(ErrorMessage.ACCOUNT_IS_NOT_FOUND);
    return this.queryBus.execute(new FindAccountByIdQuery(param.accountId));
  }
}
