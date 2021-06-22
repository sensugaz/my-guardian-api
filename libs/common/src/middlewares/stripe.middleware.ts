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
    next()
  }
}
