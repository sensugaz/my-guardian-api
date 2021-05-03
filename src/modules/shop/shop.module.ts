import { Module } from '@nestjs/common'
import { CommonModule } from '@my-guardian-api/common'
import { DatabaseModule } from '@my-guardian-api/database'
import { ShopController } from './controllers'

@Module({
  imports: [
    CommonModule,
    DatabaseModule
  ],
  controllers: [
    ShopController
  ]
})
export class ShopModule {

}