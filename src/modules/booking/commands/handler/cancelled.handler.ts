import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CancelledCommand } from '../command'
import { InjectStripe } from 'nestjs-stripe'
import Stripe from 'stripe'
import { BookingModel } from '@my-guardian-api/database'
import {
  BookingRepository,
  CustomerRepository,
  ShopRepository,
  UserRepository,
} from '@my-guardian-api/database/repositories'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus, Logger } from '@nestjs/common'
import * as moment from 'moment-timezone'
import { MailerService } from '@my-guardian-api/mailer'
import { ConfigService } from '@nestjs/config'

@CommandHandler(CancelledCommand)
export class CancelledHandler implements ICommandHandler<CancelledCommand> {
  constructor(
    @InjectStripe()
    private readonly stripeClient: Stripe,
    @InjectRepository(BookingRepository)
    private readonly bookingRepository: BookingRepository,
    @InjectRepository(CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @InjectRepository(ShopRepository)
    private readonly shopRepository: ShopRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async execute({ user, bookingId }: CancelledCommand): Promise<BookingModel> {
    const customer = await this.customerRepository.findOne({
      userId: user.id,
    })

    if (!customer) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['customer_not_found'],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }

    const booking = await this.bookingRepository.findOne(
      {
        id: bookingId,
        customer: customer,
      },
      {
        relations: ['shop', 'customer'],
      },
    )

    const shop = await this.userRepository.findOne({
      id: booking.shop.userId,
    })

    if (!booking) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['booking_not_found'],
        statusCode: HttpStatus.BAD_REQUEST,
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
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }

    booking.cancelled()

    // refund
    const refund = await this.stripeClient.refunds.create({
      payment_intent: booking.paymentIntent,
    })

    if (!refund) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['refund_failed'],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }

    booking.shop.incAvailable(booking.qty)

    await this.bookingRepository.save(booking)
    await this.shopRepository.save(booking.shop)

    try {
      await this.mailerService.sendWithTemplate(
        shop.email,
        'Réservation annulée',
        {
          url: `${this.configService.get('BACKOFFICE_URL')}/order/${
            booking.id
          }/detail`,
          bookingId: booking.id,
        },
        'cancel-booking',
      )
    } catch (e) {
      Logger.error(e)
    }

    return booking
  }
}
