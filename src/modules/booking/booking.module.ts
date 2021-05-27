import { Module } from '@nestjs/common'
import { BookingController } from './controllers'
import { CommonModule } from '@my-guardian-api/common'
import { DatabaseModule } from '@my-guardian-api/database'
import { MailerModule } from '@my-guardian-api/mailer'
import { AuthModule } from '@my-guardian-api/auth'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  BookingRepository,
  CustomerRepository,
  ShopRepository,
  VoucherHistoryRepository,
  VoucherRepository
} from '@my-guardian-api/database/repositories'
import { StripeModule } from 'nestjs-stripe'
import { ConfigService } from '@nestjs/config'
import { CommandHandlers } from './commands'
import { QueryHandlers } from './queries'

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    MailerModule,
    AuthModule,
    TypeOrmModule.forFeature([
      BookingRepository,
      CustomerRepository,
      VoucherRepository,
      VoucherHistoryRepository,
      ShopRepository
    ]),
    StripeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get<string>('STRIPE_SECRET_API_KEY'),
        apiVersion: '2020-08-27'
      })
    })
  ],
  controllers: [BookingController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers
  ]
})
export class BookingModule {

}
