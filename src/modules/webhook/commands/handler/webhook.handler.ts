import { WebhookCommand } from '../command'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { BookingRepository, ShopRepository, VoucherHistoryRepository } from '@my-guardian-api/database/repositories'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiException, BookingStatusEnum, PaymentStatusEnum } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@CommandHandler(WebhookCommand)
export class WebhookHandler implements ICommandHandler<WebhookCommand> {
  constructor(@InjectRepository(BookingRepository)
              private readonly bookingRepository: BookingRepository,
              @InjectRepository(ShopRepository)
              private readonly shopRepository: ShopRepository,
              @InjectRepository(VoucherHistoryRepository)
              private readonly voucherHistoryRepository: VoucherHistoryRepository) {
  }

  async execute({ body }: WebhookCommand): Promise<any> {
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

    console.log(booking)

    return await this.bookingRepository.save(booking)
  }
}
