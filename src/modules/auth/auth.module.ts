import { Module } from '@nestjs/common'
import { AuthController } from './controllers'
import { DatabaseModule } from '@my-guardian-api/database'
import { CommandHandlers } from './commands'
import { CommonModule } from '@my-guardian-api/common'

@Module({
  imports: [
    CommonModule,
    DatabaseModule
  ],
  controllers: [AuthController],
  providers: [
    ...CommandHandlers
  ]
})
export class AuthModule {
}
