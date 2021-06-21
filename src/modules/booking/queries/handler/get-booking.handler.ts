import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetBookingQuery } from '../query'
import {
  BookingRepository,
  CustomerRepository,
  ShopRepository,
} from '@my-guardian-api/database/repositories'
import { InjectRepository } from '@nestjs/typeorm'
import { paginate, Pagination } from 'nestjs-typeorm-paginate'
import { BookingModel } from '@my-guardian-api/database'
import {
  OrderByEnum,
  parserToTypeOrmQueryBuilder,
} from '@my-guardian-api/common'

@QueryHandler(GetBookingQuery)
export class GetBookingHandler implements IQueryHandler<GetBookingQuery> {
  constructor(
    @InjectRepository(BookingRepository)
    private readonly bookingRepository: BookingRepository,
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(ShopRepository)
    private readonly shopRepository: ShopRepository,
  ) {}

  async execute(query: GetBookingQuery): Promise<Pagination<BookingModel>> {
    const tableName = 'bookings'

    let queryBuilder: any = this.bookingRepository
      .createQueryBuilder(tableName)
      .withDeleted()
      .leftJoinAndSelect(`${tableName}.customer`, 'customer')
      .leftJoinAndSelect(`${tableName}.shop`, 'shop')

    queryBuilder = await parserToTypeOrmQueryBuilder(
      tableName,
      query.query,
      queryBuilder,
      query.sort,
      query.orderBy ?? OrderByEnum.DESC,
    )

    switch (query.user.role.key) {
      case 'CUSTOMER':
        const customer = await this.customerRepository.findOne({
          userId: query.user.id,
        })
        queryBuilder.andWhere(`${tableName}.customer.id = :customerId`, {
          customerId: customer.id,
        })
        break
      case 'SHOP':
        const shop = await this.shopRepository.findOne({
          userId: query.user.id,
        })
        queryBuilder.andWhere(`${tableName}.shop_id = :shopId`, {
          shopId: shop.id,
        })
        break
    }

    return await paginate(queryBuilder, query.options)
  }
}
