import { ICommand } from '@nestjs/cqrs'
import { UpdateCustomerDto } from '../../dtos'

export class UpdateCustomerCommand implements ICommand {
  constructor(public readonly body: UpdateCustomerDto) {
  }
}