import { NestMiddleware, UnauthorizedException } from '@nestjs/common'
import { Stripe } from 'stripe'
import { InjectStripe } from 'nestjs-stripe'
import { ConfigService } from '@nestjs/config'

export class WebhookMiddleware implements NestMiddleware {
  constructor(@InjectStripe()
              private readonly stripeClient: Stripe,
              private readonly configService: ConfigService) {
  }

  async use(req: any, res: any, next: () => void) {
    const sig = req.headers['stripe-signature']

    try {
      this.stripeClient.webhooks.constructEvent(req['parsedRawBody'], sig, this.configService.get<string>('STRIPE_SIGNING_SECRET'))
    } catch (e) {
      throw new UnauthorizedException()
    }

    next()
  }

}
