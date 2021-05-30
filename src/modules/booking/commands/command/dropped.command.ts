import { ICommand } from '@nestjs/cqrs'
import { DroppedDto } from '../../dtos'
import { UserModel } from '@my-guardian-api/database'

export class DroppedCommand implements ICommand {
  constructor(public readonly user: UserModel,
              public readonly bookingId: string,
              public readonly body: DroppedDto) {
  }
}