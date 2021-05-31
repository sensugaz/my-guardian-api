import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateDeviceIdCommand } from '../command'
import { UserModel } from '@my-guardian-api/database'
import { UserRepository } from '@my-guardian-api/database/repositories'
import { InjectRepository } from '@nestjs/typeorm'

@CommandHandler(UpdateDeviceIdCommand)
export class UpdateDeviceIdHandler implements ICommandHandler<UpdateDeviceIdCommand> {
  constructor(@InjectRepository(UserRepository)
              private readonly userRepository: UserRepository) {
  }

  async execute({ user, body }: UpdateDeviceIdCommand): Promise<UserModel> {
    user.updateDeviceId(body.deviceId)
    user = await this.userRepository.save(user)

    delete user.password
    delete user.salt
    delete user.tokens

    return user
  }

}