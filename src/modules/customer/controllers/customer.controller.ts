import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Controller, Get, Query } from '@nestjs/common'
import { PaginationDto } from '@my-guardian-api/common'
import { UserModel } from '@my-guardian-api/database'
import { Pagination } from 'nestjs-typeorm-paginate'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { GetCustomerQuery } from '../queries/query'

@ApiTags('customer')
@Controller('/customer')
@ApiBearerAuth()
// @UseGuards(AuthGuard(['jwt']), RolesGuard)
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
}