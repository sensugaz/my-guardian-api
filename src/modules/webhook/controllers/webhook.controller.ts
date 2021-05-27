import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Logger, Post } from '@nestjs/common'

@ApiTags('webhook')
@Controller('/webhook')
export class WebhookController {
  @Post()
  index(@Body() body) {
    Logger.debug(JSON.stringify(body))
    Logger.debug('----------------------------')
  }
}