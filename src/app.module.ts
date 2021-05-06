import { Module } from '@nestjs/common'
import { CustomerModule, ShopModule, UserModule, VoucherModule } from './modules'

@Module({
  imports: [
    UserModule,
    ShopModule,
    CustomerModule,
    VoucherModule
  ],
  providers: []
})
export class AppModule {
}

