import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import {
  BookingModule,
  CustomerModule,
  NotificationModule,
  ShopModule,
  UserModule,
  VoucherModule,
  WebhookModule
} from './modules'
import { JsonBodyMiddleware, RawBodyMiddleware } from '@my-guardian-api/common'
import { RouteInfo } from '@nestjs/common/interfaces'
import * as moment from 'moment-timezone'

const rawBodyParsingRoutes: Array<RouteInfo> = [
  {
    path: '/webhook',
    method: RequestMethod.POST
  }
]

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
export class AppModule implements NestModule {
  constructor() {
    moment.tz.setDefault('Europe/Paris')
  }
  
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes(...rawBodyParsingRoutes)
      .apply(JsonBodyMiddleware)
      .exclude(...rawBodyParsingRoutes)
      .forRoutes('*')
  }
}
