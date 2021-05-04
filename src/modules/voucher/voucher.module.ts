import { Module } from '@nestjs/common'
import { CommonModule } from '@my-guardian-api/common'
import { DatabaseModule } from '@my-guardian-api/database'

@Module({
  imports: [
    CommonModule,
    DatabaseModule
  ],
  controllers: []
})
export class VoucherModule {

}