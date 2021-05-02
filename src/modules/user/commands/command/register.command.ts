import { ICommand } from '@nestjs/cqrs'
import { RegisterDto } from '../../dtos'

export class RegisterCommand implements ICommand {
  constructor(public readonly body: RegisterDto) {
  }
}