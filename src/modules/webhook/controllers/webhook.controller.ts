import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, Req } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Buffer } from 'buffer'
import { WebhookCommand } from '../commands/command'

@ApiTags('webhook')
@Controller('/webhook')
export class WebhookController {
  constructor(private readonly commandBus: CommandBus,
              private readonly queryBus: QueryBus) {
  }

  @Post()
  index(@Req() req: any, @Body() body: Buffer) {
    return this.commandBus.execute(new WebhookCommand(body))
  }
}
