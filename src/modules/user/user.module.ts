import { Module } from '@nestjs/common'
import { UserController } from './controllers'
import { DatabaseModule } from '@my-guardian-api/database'
import { CommandHandlers } from './commands'
import { CommonModule } from '@my-guardian-api/common'
import { MailerModule } from '@my-guardian-api/mailer'
import { AuthModule } from '@my-guardian-api/auth'
import { QueryHandlers } from './queries'

@Module({
  imports: [CommonModule, DatabaseModule, MailerModule, AuthModule],
  controllers: [UserController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class UserModule {}
