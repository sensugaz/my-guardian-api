import { MiddlewareConsumer, Module } from '@nestjs/common'
import { CommandHandlers } from './commands'
import { WebhookController } from './controllers'
import { StripeModule } from 'nestjs-stripe'
import { ConfigService } from '@nestjs/config'
import { CommonModule } from '@my-guardian-api/common'
import { DatabaseModule } from '@my-guardian-api/database'
import { MailerModule } from '@my-guardian-api/mailer'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  BookingRepository,
  ShopRepository,
  UserRepository,
  VoucherHistoryRepository
} from '@my-guardian-api/database/repositories'
import { WebhookMiddleware } from './middlewares'

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    MailerModule,
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('STRIPE_SECRET_API_KEY'),
        apiVersion: '2020-08-27'
      })
    }),
    TypeOrmModule.forFeature([
      BookingRepository,
      VoucherHistoryRepository,
      ShopRepository,
      UserRepository
    ])
  ],
  controllers: [WebhookController],
  providers: [
    ...CommandHandlers
  ]
})
export class WebhookModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(WebhookMiddleware)
      .forRoutes('/webhook')
  }
}
