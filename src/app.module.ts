import { Module } from '@nestjs/common'
import { CustomerModule, ShopModule, UserModule } from './modules'

@Module({
  imports: [
    UserModule,
    ShopModule,
    CustomerModule
  ],
  providers: []
})
export class AppModule {
}

