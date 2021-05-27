import { Module } from '@nestjs/common'
import { BookingModule, CustomerModule, ShopModule, UserModule, VoucherModule, WebhookModule } from './modules'

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

