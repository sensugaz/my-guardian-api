import { ICommand } from '@nestjs/cqrs'
import { CreateShopDto } from '../../dtos'

export class CreateShopCommand implements ICommand {
  constructor(public readonly body: CreateShopDto) {
  }
}