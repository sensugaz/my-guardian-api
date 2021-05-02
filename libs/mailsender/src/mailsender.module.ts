import { Module } from '@nestjs/common'
import { MailSenderService } from './mailsender.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  providers: [MailSenderService],
  exports: [MailSenderService]
})
export class MailSenderModule {
}

