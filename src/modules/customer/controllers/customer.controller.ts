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
  Query,
  UseGuards,
} from '@nestjs/common'
import { PaginationDto, RoleEnum } from '@my-guardian-api/common'
import { UserModel } from '@my-guardian-api/database'
import { Pagination } from 'nestjs-typeorm-paginate'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetCustomerByIdQuery, GetCustomerQuery } from '../queries/query'
import {
  CreateCustomerCommand,
  DeleteCustomerCommand,
} from '../commands/command'
import { RolesGuard } from '@my-guardian-api/auth'
import { AuthGuard } from '@nestjs/passport'
import { Roles } from '@my-guardian-api/auth/decorators'
import { CreateCustomerDto } from '../dtos'

@ApiTags('customers')
@Controller('/customers')
@ApiBearerAuth()
@UseGuards(AuthGuard(['jwt']), RolesGuard)
@Roles(RoleEnum.ADMIN)
export class CustomerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  createCustomer(@Body() body: CreateCustomerDto): Promise<UserModel> {
    return this.commandBus.execute(new CreateCustomerCommand(body))
  }

  @Get()
  @ApiQuery({
    name: 'query',
    required: false,
  })
  getCustomer(
    @Query('query') query: string,
    @Query() param: PaginationDto,
  ): Promise<Pagination<UserModel>> {
    const { page, limit, sort, orderBy } = param
    return this.queryBus.execute(
      new GetCustomerQuery(query, sort, orderBy, {
        page: page ? page : 1,
        limit: limit > 100 ? 100 : limit,
      }),
    )
  }

  @Get(':userId')
  @ApiParam({
    name: 'userId',
    required: this,
  })
  getCustomerById(@Param('userId') userId: string): Promise<UserModel> {
    return this.queryBus.execute(new GetCustomerByIdQuery(userId))
  }

  @Delete(':userId')
  @ApiParam({
    name: 'userId',
    required: this,
  })
  @HttpCode(HttpStatus.OK)
  deleteCustomer(@Param('userId') userId: string): Promise<UserModel> {
    return this.commandBus.execute(new DeleteCustomerCommand(userId))
  }
}
