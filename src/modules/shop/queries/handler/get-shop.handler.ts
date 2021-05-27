import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetShopQuery } from '../query'
import { EntityManager } from 'typeorm'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { ShopModel, UserModel } from '@my-guardian-api/database'
import { parserToTypeOrmQueryBuilder, RoleEnum } from '@my-guardian-api/common'

@QueryHandler(GetShopQuery)
export class GetShopHandler implements IQueryHandler<GetShopQuery> {
  constructor(private readonly entityManager: EntityManager) {}

  async execute(query: GetShopQuery): Promise<Pagination<UserModel>> {
    const tableName = 'users'
    let queryBuilder: any = this.entityManager
      .getRepository(UserModel)
      .createQueryBuilder(tableName)
      .innerJoinAndSelect('users.role', 'roles')
      .innerJoinAndMapOne(
        'users.profile',
        ShopModel,
        'shops',
        'users.id = shops.user_id',
      )
      .where('roles.key = :role', { role: RoleEnum.SHOP })
      .withDeleted()
    queryBuilder = await parserToTypeOrmQueryBuilder(
      tableName,
      query.query,
      queryBuilder,
      query.sort,
      query.orderBy,
    )
    const results = await paginate(queryBuilder, query.options)

    return new Pagination(
      await Promise.all(
        results.items.map((item: UserModel) => {
          delete item.password
          delete item.salt
          return item
        }),
      ),
      results.meta,
      results.links,
    )
  }
}
