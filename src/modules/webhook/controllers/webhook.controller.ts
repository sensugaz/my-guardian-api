import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { WebhookCommand } from '../commands/command'

@ApiTags('webhook')
@Controller('/webhook')
export class WebhookController {
  constructor(private readonly commandBus: CommandBus,
              private readonly queryBus: QueryBus) {
  }

  @Post()
  index(@Body() body: any) {
    return this.commandBus.execute(new WebhookCommand(body))
  }
}