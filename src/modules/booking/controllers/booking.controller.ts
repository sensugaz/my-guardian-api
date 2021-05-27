import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CheckoutCommand } from '../commands/command'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '@my-guardian-api/auth'
import { Roles } from '@my-guardian-api/auth/decorators'
import { PaginationDto, RoleEnum } from '@my-guardian-api/common'
import { CheckoutDto } from '../dtos'
import { Pagination } from 'nestjs-typeorm-paginate'
import { BookingModel } from '@my-guardian-api/database'
import { GetBookingQuery } from '../queries/query'

@ApiTags('bookings')
@Controller('/bookings')
@ApiBearerAuth()
@UseGuards(AuthGuard(['jwt']), RolesGuard)
export class BookingController {
  constructor(private readonly commandBus: CommandBus,
              private readonly queryBus: QueryBus) {
  }

  @Post('/checkout')
  @Roles(RoleEnum.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  checkout(@Req() req, @Body() body: CheckoutDto) {
    return this.commandBus.execute(new CheckoutCommand(req.user, body))
  }

  @Get()
  @ApiQuery({
    name: 'query',
    required: false
  })
  getBooking(@Req() req,
             @Query('query') query: string,
             @Query() param: PaginationDto): Promise<Pagination<BookingModel>> {
    const { page, limit, sort, orderBy } = param
    return this.queryBus.execute(
      new GetBookingQuery(req.user, query, sort, orderBy, {
        page: page ? page : 1,
        limit: limit > 100 ? 100 : limit
      })
    )
  }
}
