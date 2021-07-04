import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CancelCommand } from '../command'
import { InjectStripe } from 'nestjs-stripe'
import Stripe from 'stripe'
import { BookingModel } from '@my-guardian-api/database'
import { BookingRepository, CustomerRepository, ShopRepository } from '@my-guardian-api/database/repositories'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'
import * as moment from 'moment-timezone'

@CommandHandler(CancelCommand)
export class CancelHandler implements ICommandHandler<CancelCommand> {
  constructor(@InjectStripe()
              private readonly stripeClient: Stripe,
              @InjectRepository(BookingRepository)
              private readonly bookingRepository: BookingRepository,
              @InjectRepository(CustomerRepository)
              private readonly customerRepository: CustomerRepository,
              @InjectRepository(ShopRepository)
              private readonly shopRepository: ShopRepository) {
  }

  async execute({ user, bookingId }: CancelCommand): Promise<BookingModel> {
    const customer = await this.customerRepository.findOne({
      userId: user.id
    })

    if (!customer) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['customer_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const booking = await this.bookingRepository.findOne({
      id: bookingId,
      customer: customer
    }, {
      relations: ['shop', 'customer']
    })

    if (!booking) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['booking_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const start = moment(booking.createdDate)
    const end = moment()
    const duration = moment.duration(end.diff(start))
    const hour = duration.asHours()

    if (hour > 3) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['booking_cancelled_over_time'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    booking.cancelled()

    // refund
    const refund = await this.stripeClient.refunds.create({
      payment_intent: booking.paymentIntent
    })

    if (!refund) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['refund_failed'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    booking.shop.incAvailable(booking.qty)

    await this.bookingRepository.save(booking)
    await this.shopRepository.save(booking.shop)
    
    return booking
  }

}
