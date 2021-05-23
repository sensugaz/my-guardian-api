import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Roles } from '@my-guardian-api/auth/decorators'
import { PaginationDto, RoleEnum } from '@my-guardian-api/common'
import { VoucherModel } from '@my-guardian-api/database'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '@my-guardian-api/auth'
import { CreateVoucherDto, UpdateVoucherDto } from '../dtos'
import { CreateVoucherCommand, DeleteVoucherCommand, UpdateVoucherCommand } from '../commands/command'
import { CheckVoucherQuery, GetVoucherByIdQuery, GetVoucherQuery } from '../queries/query'
import { Pagination } from 'nestjs-typeorm-paginate'

@ApiTags('vouchers')
@Controller('/vouchers')
@ApiBearerAuth()
@UseGuards(AuthGuard(['jwt']), RolesGuard)
export class VoucherController {
  constructor(private readonly commandBus: CommandBus,
              private readonly queryBus: QueryBus) {
  }

  @Post()
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  createVoucher(@Body() body: CreateVoucherDto): Promise<VoucherModel> {
    return this.commandBus.execute(new CreateVoucherCommand(body))
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    required: this
  })
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  updateVoucher(@Param('id') id: string, @Body() body: UpdateVoucherDto): Promise<VoucherModel> {
    return this.commandBus.execute(new UpdateVoucherCommand(id, body))
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: this
  })
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  deleteVoucher(@Param('id') id: string): Promise<VoucherModel> {
    return this.commandBus.execute(new DeleteVoucherCommand(id))
  }


  @Get()
  @ApiQuery({
    name: 'query',
    required: false
  })
  @Roles(RoleEnum.ADMIN)
  getVoucher(@Query('query') query: string,
             @Query() param: PaginationDto): Promise<Pagination<VoucherModel>> {
    const { page, limit, sort, orderBy } = param
    return this.queryBus.execute(new GetVoucherQuery(query, sort, orderBy, {
      page: page ? page : 1,
      limit: limit > 100 ? 100 : limit
    }))
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: this
  })
  @Roles(RoleEnum.ADMIN)
  getVoucherById(@Param('id') id: string): Promise<VoucherModel> {
    return this.queryBus.execute(new GetVoucherByIdQuery(id))
  }

  @Get('check/:code')
  @ApiParam({
    name: 'code',
    required: this
  })
  checkVoucher(@Req() req, @Param('code') code: string): Promise<VoucherModel> {
    return this.queryBus.execute(new CheckVoucherQuery(req.user, code))
  }
}