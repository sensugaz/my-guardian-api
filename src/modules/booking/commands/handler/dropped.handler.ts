import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DroppedCommand } from '../command'
import { BookingModel } from '@my-guardian-api/database'
import { InjectRepository } from '@nestjs/typeorm'
import {
  BookingBagRepository,
  BookingRepository,
  CustomerRepository,
  ShopBagRepository
} from '@my-guardian-api/database/repositories'
import { ApiException, PaymentStatusEnum, ShopBagStatusEnum } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@CommandHandler(DroppedCommand)
export class DroppedHandler implements ICommandHandler<DroppedCommand> {
  constructor(@InjectRepository(BookingRepository)
              private readonly bookingRepository: BookingRepository,
              @InjectRepository(BookingBagRepository)
              private readonly bookingBagRepository: BookingBagRepository,
              @InjectRepository(CustomerRepository)
              private readonly customerRepository: CustomerRepository,
              @InjectRepository(ShopBagRepository)
              private readonly shopBagRepository: ShopBagRepository) {
  }

  async execute({ user, bookingId, body }: DroppedCommand): Promise<BookingModel> {
    const customer = await this.customerRepository.findOne({
      userId: user.id
    })

    const booking = await this.bookingRepository.findOne({
      id: bookingId,
      customer: customer
    })

    if (!booking) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['booking_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    if (booking.paymentStatus !== PaymentStatusEnum.PAID) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['booking_not_paid'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    if (body.bags.length !== booking.qty) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['booking_qty_not_match'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    for (const bag of body.bags) {
      const shopBag = await this.shopBagRepository.findOne({
        shop: booking.shop,
        number: bag
      })

      if (!shopBag) {
        throw new ApiException({
          type: 'application',
          module: 'booking',
          codes: ['bag_number_invalid'],
          statusCode: HttpStatus.BAD_REQUEST
        })
      }

      if (shopBag.status === ShopBagStatusEnum.UNAVAILABLE) {
        throw new ApiException({
          type: 'application',
          module: 'booking',
          codes: ['bag_number_not_available'],
          statusCode: HttpStatus.BAD_REQUEST
        })
      }

      shopBag.setStatus(ShopBagStatusEnum.UNAVAILABLE)

      await this.shopBagRepository.save(shopBag)
    }

    return await this.bookingRepository.save(booking)
  }
}
