import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FindNotificationQuery } from '../application/query/find-notification.query';
import { FindNotificationResult } from '../application/query/result/find-notification-result';
import { FindAccountNotificationRequestParam } from './dto/FindAccountNotificationRequestParam';
import { FindNotificationRequestQueryString } from './dto/FindNotificationRequestQueryString';
import { FindNotificationResponseDto } from './dto/FindNotificationResponseDto';

@ApiTags('Notifications')
@Controller()
export class NotificationController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('notifications')
  @ApiOkResponse({ type: FindNotificationResponseDto })
  find(
    @Query() querystring: FindNotificationRequestQueryString,
  ): Promise<FindNotificationResponseDto> {
    return this.queryBus.execute<FindNotificationQuery, FindNotificationResult>(
      new FindNotificationQuery(querystring),
    );
  }

  @Get('accounts/:accountId/notifications')
  @ApiOkResponse({ type: FindNotificationResponseDto })
  findByAccount(
    @Param() param: FindAccountNotificationRequestParam,
    @Query() querystring: FindNotificationRequestQueryString,
  ): Promise<FindNotificationResponseDto> {
    return this.queryBus.execute<FindNotificationQuery, FindNotificationResult>(
      new FindNotificationQuery({ ...param, ...querystring }),
    );
  }
}
