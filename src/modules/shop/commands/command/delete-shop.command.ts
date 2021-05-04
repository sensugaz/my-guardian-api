import { ICommand } from '@nestjs/cqrs'

export class DeleteShopCommand implements ICommand {
  constructor(public readonly userId: string) {
  }
}