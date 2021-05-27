import { Injectable, NestMiddleware } from '@nestjs/common'
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

    // if (!sig) {
    //   throw new UnauthorizedException()
    // }
    //
    // try {
    //   this.stripeClient.webhooks.constructEvent(req.body, sig, this.config.get<string>('STRIPE_SIGNING_SECRET'))
    // } catch (e) {
    //   throw new UnauthorizedException()
    // }
    console.log('sig', sig)

    next()
  }
}
