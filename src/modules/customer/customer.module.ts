import { Module } from '@nestjs/common'
import { CommonModule } from '@my-guardian-api/common'
import { DatabaseModule } from '@my-guardian-api/database'
import { CustomerController } from './controllers'
import { QueryHandlers } from './queries'

@Module({
  imports: [
    CommonModule,
    DatabaseModule
  ],
  controllers: [
    CustomerController
  ],
  providers: [
    ...QueryHandlers
  ]
})
export class CustomerModule {

}