import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ShopModel, UserModel } from '@my-guardian-api/database'
import { CreateShopCommand, DeleteShopCommand, UpdateShopCommand } from '../commands/command'
import { PaginationDto, RoleEnum } from '@my-guardian-api/common'
import { Roles } from '@my-guardian-api/auth/decorators'
import { CreateShopDto, SearchDto, UpdateShopDto } from '../dtos'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '@my-guardian-api/auth'
import { Pagination } from 'nestjs-typeorm-paginate'
import { GetShopByIdQuery, GetShopQuery, SearchShopQuery } from '../queries/query'

@ApiTags('shops')
@Controller('/shops')
@ApiBearerAuth()
@UseGuards(AuthGuard(['jwt']), RolesGuard)
export class ShopController {
  constructor(private readonly commandBus: CommandBus,
              private readonly queryBus: QueryBus) {
  }

  @Get()
  @ApiQuery({
    name: 'query',
    required: false
  })
  getShop(@Query('query') query: string,
          @Query() param: PaginationDto): Promise<Pagination<UserModel>> {
    const { page, limit, sort, orderBy } = param
    return this.queryBus.execute(new GetShopQuery(query, sort, orderBy, {
      page: page ? page : 1,
      limit: limit > 100 ? 100 : limit
    }))
  }

  @Get(':userId')
  @ApiParam({
    name: 'userId',
    required: this
  })
  getShopById(@Param('userId') userId: string): Promise<UserModel> {
    return this.queryBus.execute(new GetShopByIdQuery(userId))
  }

  @Post()
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  createShop(@Body() body: CreateShopDto): Promise<UserModel> {
    return this.commandBus.execute(new CreateShopCommand(body))
  }

  @Put(':userId')
  @ApiParam({
    name: 'userId',
    required: this
  })
  @HttpCode(HttpStatus.OK)
  updateShop(@Param('userId') id: string, @Body() body: UpdateShopDto): Promise<UserModel> {
    return this.commandBus.execute(new UpdateShopCommand(id, body))
  }


  @Delete(':userId')
  @ApiParam({
    name: 'userId',
    required: this
  })
  @Roles(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  deleteShop(@Param('userId') userId: string): Promise<UserModel> {
    return this.commandBus.execute(new DeleteShopCommand(userId))
  }

  @Post('search')
  searchShop(@Body() body: SearchDto): Promise<ShopModel[]> {
    return this.queryBus.execute(new SearchShopQuery(body))
  }
}