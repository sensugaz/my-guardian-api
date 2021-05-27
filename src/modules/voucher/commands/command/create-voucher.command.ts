import { ICommand } from '@nestjs/cqrs'
import { CreateVoucherDto } from '../../dtos'

export class CreateVoucherCommand implements ICommand {
  constructor(public readonly body: CreateVoucherDto) {}
}
