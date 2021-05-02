import { ICommand } from '@nestjs/cqrs'
import { ChangePasswordDto } from '../../dtos'
import { UserModel } from '@my-guardian-api/database'

export class ChangePasswordCommand implements ICommand {
  constructor(public readonly user: UserModel,
              public readonly body: ChangePasswordDto) {
  }
}