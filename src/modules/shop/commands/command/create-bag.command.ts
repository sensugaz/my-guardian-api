import { CreateBagDto } from '../../dtos'
import { ICommand } from '@nestjs/cqrs'

export class CreateBagCommand implements ICommand {
  constructor(public readonly userId: string,
              public readonly body: CreateBagDto) {
  }
}
