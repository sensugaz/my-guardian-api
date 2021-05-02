import { ICommand } from '@nestjs/cqrs'
import { ActivateDto } from '../../dtos'

export class ActivateCommand implements ICommand {
  constructor(public readonly query: ActivateDto) {
  }
}