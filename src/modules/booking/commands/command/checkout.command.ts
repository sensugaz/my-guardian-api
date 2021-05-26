import { ICommand } from '@nestjs/cqrs'
import { UserModel } from '@my-guardian-api/database'
import { CheckoutDto } from '../../dtos'

export class CheckoutCommand implements ICommand {
  constructor(public readonly user: UserModel,
              public readonly body: CheckoutDto) {
  }
}