import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MailerService } from '@my-guardian-api/mailer/mailer.service'

@Module({
  imports: [ConfigModule],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
