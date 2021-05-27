import { ICommand } from '@nestjs/cqrs'
import { ForgotPasswordDto } from '../../dtos'

export class ForgotPasswordCommand implements ICommand {
  constructor(public readonly body: ForgotPasswordDto) {}
}
