import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { WithdrawCommand } from '../command'
import { BookingModel } from '@my-guardian-api/database'
import { InjectRepository } from '@nestjs/typeorm'
import {
  BookingBagRepository,
  BookingRepository,
  CustomerRepository,
  ShopRepository
} from '@my-guardian-api/database/repositories'
import { ApiException, BookingBagStatusEnum } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@CommandHandler(WithdrawCommand)
export class WithdrawHandler implements ICommandHandler<WithdrawCommand> {
  constructor(@InjectRepository(BookingRepository)
              private readonly bookingRepository: BookingRepository,
              @InjectRepository(BookingBagRepository)
              private readonly bookingBagRepository: BookingBagRepository,
              @InjectRepository(CustomerRepository)
              private readonly customerRepository: CustomerRepository,
              @InjectRepository(ShopRepository)
              private readonly shopRepository: ShopRepository) {
  }

  async execute({ user, bookingId }: WithdrawCommand): Promise<BookingModel> {
    const customer = await this.customerRepository.findOne({
      userId: user.id
    })

    const booking = await this.bookingRepository.findOne({
      id: bookingId,
      customer: customer
    }, {
      relations: ['shop']
    })

    if (!booking) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['booking_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    if (booking.bookingBagStatus != BookingBagStatusEnum.DROPPED) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['booking_not_dropped'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    booking.withdraw()

    const shop = await this.shopRepository.findOneWithDelete(booking.shop?.id)

    if (shop) {
      shop.incAvailable(booking.qty)
    }

    await this.shopRepository.save(shop)

    return await this.bookingRepository.save(booking)
  }

}