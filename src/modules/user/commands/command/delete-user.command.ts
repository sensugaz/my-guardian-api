import { ICommand } from '@nestjs/cqrs'
import { UserModel } from '@my-guardian-api/database'

export class DeleteUserCommand implements ICommand {
  constructor(public readonly user: UserModel) {
  }
}