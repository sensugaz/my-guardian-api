import { Module } from '@nestjs/common'
import { BookingModule, CustomerModule, ShopModule, UserModule, VoucherModule } from './modules'

@Module({
  imports: [
    UserModule,
    ShopModule,
    CustomerModule,
    VoucherModule,
    BookingModule
  ],
  providers: []
})
export class AppModule {
}

