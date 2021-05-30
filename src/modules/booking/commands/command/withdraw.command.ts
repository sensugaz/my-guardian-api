import { ICommand } from '@nestjs/cqrs'
import { UserModel } from '@my-guardian-api/database'

export class WithdrawCommand implements ICommand {
  constructor(public readonly user: UserModel,
              public readonly bookingId: string) {
  }
}