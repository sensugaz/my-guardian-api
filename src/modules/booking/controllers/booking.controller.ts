import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CancelledCommand, CheckoutCommand, DroppedCommand, WithdrawCommand } from '../commands/command'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '@my-guardian-api/auth'
import { Roles } from '@my-guardian-api/auth/decorators'
import { PaginationDto, RoleEnum } from '@my-guardian-api/common'
import { CheckoutDto, DroppedDto } from '../dtos'
import { Pagination } from 'nestjs-typeorm-paginate'
import { BookingModel } from '@my-guardian-api/database'
import { GetBookingByIdQuery, GetBookingQuery } from '../queries/query'
import { FirebaseAdmin, InjectFirebaseAdmin } from 'nestjs-firebase'

@ApiTags('bookings')
@Controller('/bookings')
@ApiBearerAuth()
@UseGuards(AuthGuard(['jwt']), RolesGuard)
export class BookingController {
  constructor(private readonly commandBus: CommandBus,
              private readonly queryBus: QueryBus,
              @InjectFirebaseAdmin()
              private readonly firebase: FirebaseAdmin) {
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

  @Put('/:id/dropped')
  @ApiParam({
    name: 'id',
    required: true
  })
  @Roles(RoleEnum.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  dropped(@Req() req, @Param('id') id: string, @Body() body: DroppedDto): Promise<BookingModel> {
    return this.commandBus.execute(new DroppedCommand(req.user, id, body))
  }

  @Put('/:id/withdraw')
  @ApiParam({
    name: 'id',
    required: true
  })
  @Roles(RoleEnum.CUSTOMER)
  @HttpCode(HttpStatus.OK)
  withdraw(@Req() req, @Param('id') id: string): Promise<BookingModel> {
    return this.commandBus.execute(new WithdrawCommand(req.user, id))
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: this
  })
  getBookingById(@Req() req, @Param('id') id: string): Promise<BookingModel> {
    return this.queryBus.execute(new GetBookingByIdQuery(req.user, id))
  }

  @Put(':id/cancelled')
  @ApiParam({
    name: 'id',
    required: this
  })
  cancelBooking(@Req() req, @Param('id') id: string): Promise<BookingModel> {
    return this.commandBus.execute(new CancelledCommand(req.user, id))
  }
}
