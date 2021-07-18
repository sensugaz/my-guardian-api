import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetBagQuery } from '../query'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { ShopBagModel } from '@my-guardian-api/database'
import { InjectRepository } from '@nestjs/typeorm'
import { ShopBagRepository, ShopRepository, UserRepository } from '@my-guardian-api/database/repositories'
import { ApiException, parserToTypeOrmQueryBuilder } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@QueryHandler(GetBagQuery)
export class GetBagHandler implements IQueryHandler<GetBagQuery> {
  constructor(@InjectRepository(UserRepository)
              private readonly userRepository: UserRepository,
              @InjectRepository(ShopRepository)
              private readonly shopRepository: ShopRepository,
              @InjectRepository(ShopBagRepository)
              private readonly shopBagRepository: ShopBagRepository) {
  }

  async execute(query: GetBagQuery): Promise<Pagination<ShopBagModel>> {
    const user = await this.userRepository.findOne({ id: query.userId })

    if (!user) {
      throw new ApiException({
        type: 'application',
        module: 'shop',
        codes: ['shop_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const shop = await this.shopRepository.findOne({
      userId: user.id
    })

    if (!shop) {
      throw new ApiException({
        type: 'application',
        module: 'shop',
        codes: ['shop_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const tableName = 'shop_bags'
    let queryBuilder: any = this.shopBagRepository
      .createQueryBuilder(tableName)
      .where('shop_id = :shopId', { shopId: shop.id })

    queryBuilder = await parserToTypeOrmQueryBuilder(
      tableName,
      query.query,
      queryBuilder,
      query.sort,
      query.orderBy
    )

    return await paginate(queryBuilder, query.options)
  }
}
