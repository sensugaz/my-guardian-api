import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetVoucherQuery } from '../query'
import { VoucherModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { parserToTypeOrmQueryBuilder } from '@my-guardian-api/common'

@QueryHandler(GetVoucherQuery)
export class GetVoucherHandler implements IQueryHandler<GetVoucherQuery> {
  constructor(private readonly entityManager: EntityManager) {
  }

  async execute(query: GetVoucherQuery): Promise<Pagination<VoucherModel>> {
    const tableName = 'vouchers'
    let queryBuilder: any = this.entityManager.getRepository(VoucherModel)
      .createQueryBuilder(tableName)
      .withDeleted()
    queryBuilder = await parserToTypeOrmQueryBuilder(tableName, query.query, queryBuilder, query.sort, query.orderBy)
    return await paginate(queryBuilder, query.options)
  }

}