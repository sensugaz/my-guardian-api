import { Module } from '@nestjs/common'
import { BookingModule, CustomerModule, ShopModule, UserModule, VoucherModule } from './modules'
import { WebhookModule } from './modules/webhook/webhook.module'

@Module({
  imports: [
    UserModule,
    ShopModule,
    CustomerModule,
    VoucherModule,
    BookingModule,
    WebhookModule
  ],
  providers: []
})
export class AppModule {
}
