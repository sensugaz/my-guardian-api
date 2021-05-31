import { ICommand } from '@nestjs/cqrs'
import { UserModel } from '@my-guardian-api/database'
import { UpdateDeviceDto } from '../../dtos'

export class UpdateDeviceIdCommand implements ICommand {
  constructor(public readonly user: UserModel,
              public readonly body: UpdateDeviceDto) {
  }
}