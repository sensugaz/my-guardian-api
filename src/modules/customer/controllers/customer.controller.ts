import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Controller, Delete, Get, HttpCode, HttpStatus, Param, Query, UseGuards } from '@nestjs/common'
import { PaginationDto, RoleEnum } from '@my-guardian-api/common'
import { UserModel } from '@my-guardian-api/database'
import { Pagination } from 'nestjs-typeorm-paginate'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetCustomerByIdQuery, GetCustomerQuery } from '../queries/query'
import { DeleteCustomerCommand } from '../commands/command'
import { RolesGuard } from '@my-guardian-api/auth'
import { AuthGuard } from '@nestjs/passport'
import { Roles } from '@my-guardian-api/auth/decorators'

@ApiTags('customers')
@Controller('/customers')
@ApiBearerAuth()
@UseGuards(AuthGuard(['jwt']), RolesGuard)
@Roles(RoleEnum.ADMIN)
export class CustomerController {
  constructor(private readonly commandBus: CommandBus,
              private readonly queryBus: QueryBus) {
  }

  @Get()
  @ApiQuery({
    name: 'query',
    required: false
  })
  getCustomer(@Query('query') query: string,
              @Query() param: PaginationDto): Promise<Pagination<UserModel>> {
    const { page, limit, sort, orderBy } = param
    return this.queryBus.execute(new GetCustomerQuery(query, sort, orderBy, {
      page: page ? page : 1,
      limit: limit > 100 ? 100 : limit
    }))
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: this
  })
  getCustomerById(@Param('id') userId: string): Promise<UserModel> {
    return this.queryBus.execute(new GetCustomerByIdQuery(userId))
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: this
  })
  @HttpCode(HttpStatus.OK)
  deleteCustomer(@Param('id') userId: string): Promise<UserModel> {
    return this.commandBus.execute(new DeleteCustomerCommand(userId))
  }
}