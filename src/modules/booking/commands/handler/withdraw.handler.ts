import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { WithdrawCommand } from '../command'
import { BookingModel } from '@my-guardian-api/database'
import { InjectRepository } from '@nestjs/typeorm'
import {
  BookingBagRepository,
  BookingRepository,
  CustomerRepository,
  ShopBagRepository,
  ShopRepository
} from '@my-guardian-api/database/repositories'
import { ApiException, BookingBagStatusEnum, ShopBagStatusEnum } from '@my-guardian-api/common'
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
              private readonly shopRepository: ShopRepository,
              @InjectRepository(ShopBagRepository)
              private readonly shopBagRepository: ShopBagRepository) {
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

    for (const bag of booking.bags) {
      const shopBag = await this.shopBagRepository.findOne({
        shop: booking.shop,
        number: bag.number
      })

      shopBag.setStatus(ShopBagStatusEnum.AVAILABLE)

      await this.shopBagRepository.save(shopBag)
    }

    return await this.bookingRepository.save(booking)
  }

}
