import { Module } from '@nestjs/common'
import { AuthController } from './controllers'
import { DatabaseModule } from '@my-guardian-api/database'
import { CommandHandlers } from './commands'
import { CommonModule } from '@my-guardian-api/common'
import { MailerModule } from '@my-guardian-api/mailer'

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    MailerModule
  ],
  controllers: [AuthController],
  providers: [
    ...CommandHandlers
  ]
})
export class AuthModule {
}
