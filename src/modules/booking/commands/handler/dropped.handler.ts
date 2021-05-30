import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DroppedCommand } from '../command'
import { BookingModel } from '@my-guardian-api/database'
import { InjectRepository } from '@nestjs/typeorm'
import { BookingBagRepository, BookingRepository, CustomerRepository } from '@my-guardian-api/database/repositories'
import { ApiException, PaymentStatusEnum } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@CommandHandler(DroppedCommand)
export class DroppedHandler implements ICommandHandler<DroppedCommand> {
  constructor(@InjectRepository(BookingRepository)
              private readonly bookingRepository: BookingRepository,
              @InjectRepository(BookingBagRepository)
              private readonly bookingBagRepository: BookingBagRepository,
              @InjectRepository(CustomerRepository)
              private readonly customerRepository: CustomerRepository) {
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
      booking.dropped(this.bookingBagRepository.create({
        number: bag,
        droppedAt: new Date()
      }))
    }

    return await this.bookingRepository.save(booking)
  }
}