import { WebhookCommand } from '../command'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  BookingRepository,
  ShopRepository,
  UserRepository,
  VoucherHistoryRepository
} from '@my-guardian-api/database/repositories'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiException, BookingStatusEnum, PaymentStatusEnum } from '@my-guardian-api/common'
import { HttpStatus, Logger } from '@nestjs/common'
import { BookingModel } from '@my-guardian-api/database'
import { MailerService } from '@my-guardian-api/mailer'

@CommandHandler(WebhookCommand)
export class WebhookHandler implements ICommandHandler<WebhookCommand> {
  constructor(@InjectRepository(BookingRepository)
              private readonly bookingRepository: BookingRepository,
              @InjectRepository(ShopRepository)
              private readonly shopRepository: ShopRepository,
              @InjectRepository(VoucherHistoryRepository)
              private readonly voucherHistoryRepository: VoucherHistoryRepository,
              @InjectRepository(UserRepository)
              private readonly userRepository: UserRepository,
              private readonly mailerService: MailerService) {
  }

  async execute({ body }: WebhookCommand): Promise<BookingModel> {
    const booking = await this.bookingRepository.findOne({
      id: body.data?.object?.metadata?.bookingId
    }, {
      relations: ['shop', 'customer']
    })

    console.log(booking)

    if (!booking) {
      throw new ApiException({
        type: 'application',
        module: 'user',
        codes: ['booking_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    switch (body.type) {
      case 'payment_intent.succeeded':
        booking.updatePaymentStatus(PaymentStatusEnum.PAID)
        booking.updateBookingStatus(BookingStatusEnum.COMPLETED)

        booking.shop.decAvailable(booking.qty)

        await this.shopRepository.save(booking.shop)

        if (!booking.voucherCode) {
          Logger.debug('WTF')
          await this.voucherHistoryRepository.save(this.voucherHistoryRepository.create({
            user: {
              id: booking.customer.userId
            },
            code: booking.voucherCode
          }))
        }
        break
      case 'payment_intent.processing':
        booking.updatePaymentStatus(PaymentStatusEnum.PROCESSING)
        break
      case 'payment_intent.canceled':
        booking.updatePaymentStatus(PaymentStatusEnum.FAILED)
        booking.updateBookingStatus(BookingStatusEnum.CANCELLED)
        break
      case 'payment_intent.payment_failed':
        booking.updatePaymentStatus(PaymentStatusEnum.FAILED)
        booking.updateBookingStatus(BookingStatusEnum.FAILED)
        break
    }

    const user = await this.userRepository.findOne({ id: booking.shop.userId })

    if (booking.qty == 1) {
      await this.mailerService.sendWithTemplate(user.email, 'New order solo offer', {}, 'solo-booking')
    } else {
      await this.mailerService.sendWithTemplate(user.email, 'New order duo offer', {}, 'duo-booking')
    }

    return await this.bookingRepository.save(booking)
  }
}
