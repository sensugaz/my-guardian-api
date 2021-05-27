import { WebhookCommand } from '../command'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { Logger } from '@nestjs/common'

@CommandHandler(WebhookCommand)
export class WebhookHandler implements ICommandHandler<WebhookCommand> {
  execute({ body }: WebhookCommand): Promise<any> {
    Logger.debug(JSON.stringify(body))
    return
  }

}