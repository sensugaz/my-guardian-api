import { ICommand } from '@nestjs/cqrs'
import { UpdateVoucherDto } from '../../dtos'

export class UpdateVoucherCommand implements ICommand {
  constructor(public readonly id: string,
              public readonly body: UpdateVoucherDto) {
  }
}