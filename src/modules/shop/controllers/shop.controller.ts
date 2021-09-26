import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { ShopBagModel, ShopModel, UserModel } from '@my-guardian-api/database'
import {
  CreateBagCommand,
  CreateShopCommand,
  DeleteBagCommand,
  DeleteShopCommand,
  UpdateShopCommand
} from '../commands/command'
import { PaginationDto, RoleEnum } from '@my-guardian-api/common'
import { Roles } from '@my-guardian-api/auth/decorators'
import { CreateBagDto, CreateShopDto, SearchDto, UpdateShopDto } from '../dtos'
import { Pagination } from 'nestjs-typeorm-paginate'
import { GetBagByIdQuery, GetBagQuery, GetShopByIdQuery, GetShopQuery, SearchShopQuery } from '../queries/query'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '@my-guardian-api/auth'

@ApiTags('shops')
@Controller('/shops')
@ApiBearerAuth()
@UseGuards(AuthGuard(['jwt']), RolesGuard)
export class ShopController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {
  }

  @Get()
  @ApiQuery({
    name: 'query',
    required: false
  })
  getShop(
    @Query('query') query: string,
    @Query() param: PaginationDto
  ): Promise<Pagination<UserModel>> {
    const { page, limit, sort, orderBy } = param
    return this.queryBus.execute(
      new GetShopQuery(query, sort, orderBy, {
        page: page ? page : 1,
        limit: limit > 100 ? 100 : limit
      })
    )
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
  updateShop(
    @Param('userId') id: string,
    @Body() body: UpdateShopDto
  ): Promise<UserModel> {
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
  @HttpCode(HttpStatus.OK)
  searchShop(@Body() body: SearchDto): Promise<ShopModel[]> {
    return this.queryBus.execute(new SearchShopQuery(body))
  }

  @Get(':userId/bags')
  @ApiParam({
    name: 'userId',
    required: this
  })
  @ApiQuery({
    name: 'query',
    required: false
  })
  @Roles(RoleEnum.ADMIN, RoleEnum.SHOP)
  getBag(@Param('userId') userId: string,
         @Query('query') query: string,
         @Query() param: PaginationDto): Promise<Pagination<ShopBagModel>> {
    const { page, limit, sort, orderBy } = param
    return this.queryBus.execute(new GetBagQuery(userId, query, sort, orderBy, {
      page: page ? page : 1,
      limit: limit > 100 ? 100 : limit
    }))
  }

  @Get(':userId/bags/:bagId')
  @ApiParam({
    name: 'userId',
    required: this
  })
  @ApiParam({
    name: 'bagId',
    required: this
  })
  @Roles(RoleEnum.ADMIN, RoleEnum.SHOP)
  getBagById(@Param('userId') userId: string,
             @Param('bagId') bagId: string): Promise<ShopBagModel> {
    return this.queryBus.execute(new GetBagByIdQuery(userId, bagId))
  }

  @Post(':userId/bags')
  @Roles(RoleEnum.ADMIN, RoleEnum.SHOP)
  createBag(@Param('userId') userId: string, @Body() body: CreateBagDto): Promise<ShopModel> {
    return this.commandBus.execute(new CreateBagCommand(userId, body))
  }

  @Delete(':userId/bags/:bagId')
  @ApiParam({
    name: 'userId',
    required: this
  })
  @ApiParam({
    name: 'bagId',
    required: this
  })
  @Roles(RoleEnum.ADMIN, RoleEnum.SHOP)
  deleteBag(@Param('userId') userId: string,
            @Param('bagId') bagId: string): Promise<ShopBagModel> {
    return this.commandBus.execute(new DeleteBagCommand(userId, bagId))
  }

}
