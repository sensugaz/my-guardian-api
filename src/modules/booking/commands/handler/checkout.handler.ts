import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CheckoutCommand } from '../command'
import { InjectStripe } from 'nestjs-stripe'
import Stripe from 'stripe'
import { HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CustomerRepository, ShopRepository, VoucherRepository } from '@my-guardian-api/database/repositories'
import { ApiException } from '@my-guardian-api/common'

@CommandHandler(CheckoutCommand)
export class CheckoutHandler implements ICommandHandler<CheckoutCommand> {
  constructor(@InjectStripe()
              private readonly stripeClient: Stripe,
              @InjectRepository(CustomerRepository)
              private readonly customerRepository: CustomerRepository,
              @InjectRepository(ShopRepository)
              private readonly shopRepository: ShopRepository,
              @InjectRepository(VoucherRepository)
              private readonly voucherRepository: VoucherRepository) {
  }

  async execute({
                  user,
                  body
                }: CheckoutCommand): Promise<{ paymentIntent: string, ephemeralKey: string, customer: string }> {
    let customer = await this.customerRepository.findOne({
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

    const shop = await this.shopRepository.findOne({
      id: body.shopId
    }, {
      relations: ['schedules', 'prices']
    })

    if (!shop) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['shop_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const schedule = shop.schedules.find(i => i.id === body.scheduleId)

    if (!schedule) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['schedule_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const price = shop.prices.find(i => i.id === body.priceId)

    if (!price) {
      throw new ApiException({
        type: 'application',
        module: 'booking',
        codes: ['price_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    let amount = price.price
    let discount = 0
    if (body.voucherCode) {
      const voucher = await this.voucherRepository.findOne({
        code: body.voucherCode
      })

      if (!voucher) {
        throw new ApiException({
          type: 'application',
          module: 'booking',
          codes: ['voucher_not_found'],
          statusCode: HttpStatus.BAD_REQUEST
        })
      }

      discount = amount * (voucher.percent / 100)
    }

    amount = Number(amount) - discount

    // save to database

    if (!customer.stripeCustomerId) {
      const { id } = await this.stripeClient.customers.create()
      customer.setStripeCustomerId(id)
      customer = await this.customerRepository.save(customer)
    }

    const ephemeralKey = await this.stripeClient.ephemeralKeys.create(
      { customer: customer.stripeCustomerId },
      { apiVersion: '2020-08-27' }
    )

    const paymentIntent = await this.stripeClient.paymentIntents.create({
      amount: Number(amount + '00'),
      currency: 'eur',
      customer: customer.stripeCustomerId
    })

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.stripeCustomerId
    }
  }
}