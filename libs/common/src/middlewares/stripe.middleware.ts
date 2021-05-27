import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'
import { InjectStripe } from 'nestjs-stripe'

@Injectable()
export class StripeMiddleware implements NestMiddleware {
  constructor(private readonly config: ConfigService,
              @InjectStripe()
              private readonly stripeClient: Stripe) {
  }

  use(req: any, res: any, next: () => void): any {
    const sig = req.headers['stripe-signature']
    const secret = this.config.get<string>('STRIPE_SIGNING_SECRET')
    //
    // if (!sig) {
    //   throw new UnauthorizedException()
    // }
    Logger.debug(req)
    Logger.debug(sig)
    Logger.debug(secret)

    try {
      this.stripeClient.webhooks.constructEvent(req.body, sig, secret)
    } catch (e) {
      Logger.error(e)
    }

    next()
  }
}
