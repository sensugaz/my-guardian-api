import { WebhookCommand } from '../command'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  BookingRepository,
  ShopRepository,
  UserRepository,
  VoucherHistoryRepository,
} from '@my-guardian-api/database/repositories'
import { InjectRepository } from '@nestjs/typeorm'
import {
  ApiException,
  BookingStatusEnum,
  PaymentStatusEnum,
} from '@my-guardian-api/common'
import { HttpStatus, Logger } from '@nestjs/common'
import { BookingModel } from '@my-guardian-api/database'
import { MailerService } from '@my-guardian-api/mailer'
import { ConfigService } from '@nestjs/config'

@CommandHandler(WebhookCommand)
export class WebhookHandler implements ICommandHandler<WebhookCommand> {
  constructor(
    @InjectRepository(BookingRepository)
    private readonly bookingRepository: BookingRepository,
    @InjectRepository(ShopRepository)
    private readonly shopRepository: ShopRepository,
    @InjectRepository(VoucherHistoryRepository)
    private readonly voucherHistoryRepository: VoucherHistoryRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async execute({ body }: WebhookCommand): Promise<BookingModel> {
    let booking = await this.bookingRepository.findOne(
      {
        id: body.data?.object?.metadata?.bookingId,
      },
      {
        relations: ['shop', 'customer'],
      },
    )

    if (!booking) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['booking_not_found'],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }

    if (body.type === 'payment_intent.succeeded') {
      booking.updatePaymentStatus(PaymentStatusEnum.PAID)
      booking.updateBookingStatus(BookingStatusEnum.COMPLETED)

      booking.shop.decAvailable(booking.qty)

      await this.shopRepository.save(booking.shop)

      if (booking.voucherCode) {
        await this.voucherHistoryRepository.save(
          this.voucherHistoryRepository.create({
            user: {
              id: booking.customer.userId,
            },
            code: booking.voucherCode,
          }),
        )
      }

      const user = await this.userRepository.findOne({
        id: booking.shop.userId,
      })

      if (booking.qty == 1) {
        try {
          await this.mailerService.sendWithTemplate(
            user.email,
            'New order solo offer',
            {
              url: `${this.configService.get('BACKOFFICE_URL')}/order/${
                booking.id
              }/detail`,
              bookingId: booking.id,
            },
            'solo-booking',
          )
        } catch (e) {
          Logger.error(e)
        }
      } else {
        try {
          await this.mailerService.sendWithTemplate(
            user.email,
            'New order duo offer',
            {
              url: `${this.configService.get('BACKOFFICE_URL')}/order/${
                booking.id
              }/detail`,
              bookingId: booking.id,
            },
            'duo-booking',
          )
        } catch (e) {
          Logger.error(e)
        }
      }
    } else if (body.type === 'payment_intent.processing') {
      booking.updatePaymentStatus(PaymentStatusEnum.PROCESSING)
    } else if (body.type === 'payment_intent.canceled') {
      booking.updatePaymentStatus(PaymentStatusEnum.FAILED)
      booking.updateBookingStatus(BookingStatusEnum.CANCELLED)
    } else if (body.type === 'payment_intent.payment_failed') {
      booking.updatePaymentStatus(PaymentStatusEnum.FAILED)
      booking.updateBookingStatus(BookingStatusEnum.FAILED)
    } else if (body.type === 'charge.refunded') {
      booking.updatePaymentStatus(PaymentStatusEnum.REFUND)
      booking.updateBookingStatus(BookingStatusEnum.CANCELLED)
    }

    // switch (body.type) {
    //   case 'payment_intent.succeeded':
    //     booking.updatePaymentStatus(PaymentStatusEnum.PAID)
    //     booking.updateBookingStatus(BookingStatusEnum.COMPLETED)

    //     booking.shop.decAvailable(booking.qty)

    //     await this.shopRepository.save(booking.shop)

    //     if (booking.voucherCode) {
    //       await this.voucherHistoryRepository.save(
    //         this.voucherHistoryRepository.create({
    //           user: {
    //             id: booking.customer.userId,
    //           },
    //           code: booking.voucherCode,
    //         }),
    //       )
    //     }

    //     const user = await this.userRepository.findOne({
    //       id: booking.shop.userId,
    //     })

    //     if (booking.qty == 1) {
    //       try {
    //         await this.mailerService.sendWithTemplate(
    //           user.email,
    //           'New order solo offer',
    //           {
    //             url: `${this.configService.get('BACKOFFICE_URL')}/order/${
    //               booking.id
    //             }/detail`,
    //             bookingId: booking.id,
    //           },
    //           'solo-booking',
    //         )
    //       } catch (e) {
    //         Logger.error(e)
    //       }
    //     } else {
    //       try {
    //         await this.mailerService.sendWithTemplate(
    //           user.email,
    //           'New order duo offer',
    //           {
    //             url: `${this.configService.get('BACKOFFICE_URL')}/order/${
    //               booking.id
    //             }/detail`,
    //             bookingId: booking.id,
    //           },
    //           'duo-booking',
    //         )
    //       } catch (e) {
    //         Logger.error(e)
    //       }
    //     }
    //     break
    //   case 'payment_intent.processing':
    //     booking.updatePaymentStatus(PaymentStatusEnum.PROCESSING)
    //     break
    //   case 'payment_intent.canceled':
    //     booking.updatePaymentStatus(PaymentStatusEnum.FAILED)
    //     booking.updateBookingStatus(BookingStatusEnum.CANCELLED)
    //     break
    //   case 'payment_intent.payment_failed':
    //     booking.updatePaymentStatus(PaymentStatusEnum.FAILED)
    //     booking.updateBookingStatus(BookingStatusEnum.FAILED)
    //     break
    //   case 'charge.refunded':
    //     booking.updatePaymentStatus(PaymentStatusEnum.REFUND)
    //     booking.updateBookingStatus(BookingStatusEnum.CANCELLED)
    //     break
    // }

    booking = await this.bookingRepository.save(booking)

    console.log(booking)

    return booking
  }
}
