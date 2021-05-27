import { Module } from '@nestjs/common'
import { CommonModule } from '@my-guardian-api/common'
import { DatabaseModule } from '@my-guardian-api/database'
import { VoucherController } from './controllers'
import { CommandHandlers } from './commands'
import { QueryHandlers } from './queries'

@Module({
  imports: [CommonModule, DatabaseModule],
  controllers: [VoucherController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class VoucherModule {}
