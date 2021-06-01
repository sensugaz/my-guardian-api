import { Module } from '@nestjs/common'
import {
  BookingModule,
  CustomerModule,
  NotificationModule,
  ShopModule,
  UserModule,
  VoucherModule,
  WebhookModule
} from './modules'

@Module({
  imports: [
    UserModule,
    ShopModule,
    CustomerModule,
    VoucherModule,
    BookingModule,
    WebhookModule,
    NotificationModule
  ],
  providers: []
})
export class AppModule {
}
