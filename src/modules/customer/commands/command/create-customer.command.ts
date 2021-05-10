import { ICommand } from '@nestjs/cqrs'
import { CreateCustomerDto } from '../../dtos'

export class CreateCustomerCommand implements ICommand {
  constructor(public readonly body: CreateCustomerDto) {
  }
}