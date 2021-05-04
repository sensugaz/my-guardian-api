import { ICommand } from '@nestjs/cqrs'
import { UpdateShopDto } from '../../dtos'

export class UpdateShopCommand implements ICommand {
  constructor(public readonly userId: string,
              public readonly body: UpdateShopDto) {
  }
}