import { ICommand } from '@nestjs/cqrs'

export class WebhookCommand implements ICommand {
  constructor(public body: any) {
  }
}