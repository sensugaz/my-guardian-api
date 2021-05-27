import { Module } from '@nestjs/common'
import { WebhookController } from './controllers'
import { CommonModule } from '@my-guardian-api/common'
import { DatabaseModule } from '@my-guardian-api/database'

@Module({
  imports: [
    CommonModule,
    DatabaseModule
  ],
  controllers: [WebhookController]
})
export class WebhookModule {

}