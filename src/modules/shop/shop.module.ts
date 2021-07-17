import { Module } from '@nestjs/common'
import { CommonModule } from '@my-guardian-api/common'
import { DatabaseModule } from '@my-guardian-api/database'
import { ShopController } from './controllers'
import { CommandHandlers } from './commands'
import { QueryHandlers } from './queries'
import { GoogleMapModule } from '@my-guardian-api/google-map'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  ConfigRepository,
  RoleRepository,
  ShopBagRepository,
  ShopPriceRepository,
  ShopRepository,
  ShopScheduleRepository,
  UserRepository,
  UserTokenRepository
} from '@my-guardian-api/database/repositories'

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    GoogleMapModule,
    TypeOrmModule.forFeature([
      UserRepository,
      UserTokenRepository,
      ShopRepository,
      RoleRepository,
      ShopBagRepository,
      ShopPriceRepository,
      ShopScheduleRepository,
      ConfigRepository
    ])
  ],
  controllers: [ShopController],
  providers: [...CommandHandlers, ...QueryHandlers]
})
export class ShopModule {
}
