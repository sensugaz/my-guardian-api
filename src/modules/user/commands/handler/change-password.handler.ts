import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ChangePasswordCommand } from '../command'
import { UserModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { HttpStatus } from '@nestjs/common'
import { ApiException } from '@my-guardian-api/common'

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordHandler implements ICommandHandler<ChangePasswordCommand> {
  constructor(private readonly entityManager: EntityManager) {
  }

  async execute({ user, body }: ChangePasswordCommand): Promise<UserModel> {
    const compare = await bcrypt.compare(body.oldPassword, user.password)

    if (!compare) {
      throw new ApiException({
        type: 'application',
        module: 'user',
        codes: ['old_password_not_match'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(body.newPassword, salt)

    user.changePassword(password, salt)

    await this.entityManager.save(user)

    delete user.password
    delete user.salt
    
    return user
  }

}