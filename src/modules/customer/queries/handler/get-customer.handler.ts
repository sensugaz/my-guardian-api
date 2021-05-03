import { GetCustomerQuery } from '../query'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { EntityManager } from 'typeorm'
import { CustomerModel, UserModel } from '@my-guardian-api/database'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { parserToTypeOrmQueryBuilder } from '@my-guardian-api/common'

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<GetCustomerQuery> {
  constructor(private readonly entityManager: EntityManager) {
  }

  async execute(query: GetCustomerQuery): Promise<Pagination<UserModel>> {
    const tableName = 'users'
    let queryBuilder: any = this.entityManager.getRepository(UserModel)
      .createQueryBuilder(tableName)
      .innerJoinAndSelect('users.role', 'roles')
      .innerJoinAndMapOne('users.profile', CustomerModel, 'customers', 'users.id = customers.user_id')
      .where('roles.key = :role', { role: 'CUSTOMER' })
      .withDeleted()
    queryBuilder = await parserToTypeOrmQueryBuilder(tableName, query.query, queryBuilder, query.sort, query.orderBy)
    const results = await paginate(queryBuilder, query.options)

    return new Pagination(
      await Promise.all(
        results.items.map((item: UserModel) => {
          delete item.password
          delete item.salt
          return item
        })
      ),
      results.meta,
      results.links
    )
  }
}
