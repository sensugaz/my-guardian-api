import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { CheckoutCommand } from '../commands/command'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '@my-guardian-api/auth'
import { Roles } from '@my-guardian-api/auth/decorators'
import { RoleEnum } from '@my-guardian-api/common'
import { CheckoutDto } from '../dtos'

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
}
