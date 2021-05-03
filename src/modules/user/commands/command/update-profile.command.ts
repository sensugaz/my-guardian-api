import { ICommand } from '@nestjs/cqrs'
import { UpdateProfileDto } from '../../dtos'
import { UserModel } from '@my-guardian-api/database'

export class UpdateProfileCommand implements ICommand {
  constructor(public readonly user: UserModel,
              public readonly body: UpdateProfileDto) {
  }
}