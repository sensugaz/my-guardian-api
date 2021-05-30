import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetBookingByIdQuery } from '../query'
import { InjectRepository } from '@nestjs/typeorm'
import { BookingRepository, CustomerRepository, ShopRepository } from '@my-guardian-api/database/repositories'
import { BookingModel } from '@my-guardian-api/database'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@QueryHandler(GetBookingByIdQuery)
export class GetBookingByIdHandler implements IQueryHandler<GetBookingByIdQuery> {
  constructor(@InjectRepository(BookingRepository)
              private readonly bookingRepository: BookingRepository,
              @InjectRepository(CustomerRepository)
              private readonly customerRepository: CustomerRepository,
              @InjectRepository(ShopRepository)
              private readonly shopRepository: ShopRepository) {
  }

  async execute(query: GetBookingByIdQuery): Promise<BookingModel> {
    const tableName = 'booking'
    let queryBuilder: any = this.bookingRepository
      .createQueryBuilder(tableName)
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.shop', 'shop')
      .withDeleted()

    switch (query.user.role.key) {
      case 'CUSTOMER':
        const customer = await this.customerRepository.findOne({ userId: query.user.id })
        queryBuilder = queryBuilder.where('booking.customer.id = :customerId', { customerId: customer.id })
        break
      case 'SHOP':
        const shop = await this.customerRepository.findOne({ userId: query.user.id })
        queryBuilder = queryBuilder.where('booking.shop.id = :shopId', { shopId: shop.id })
        break
    }

    const booking = queryBuilder.findOne()

    if (!booking) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['booking_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    return booking
  }

}