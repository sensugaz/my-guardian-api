import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteUserCommand } from '../command'
import { MailerService } from '@my-guardian-api/mailer'
import { EntityManager } from 'typeorm'
import { UserModel } from '@my-guardian-api/database'
import { Logger } from '@nestjs/common'

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly mailerService: MailerService
  ) {
  }

  async execute({ user }: DeleteUserCommand): Promise<any> {
    user.inActivate()
    await this.entityManager.save(UserModel, user)
    await this.entityManager.softRemove(user)

    try {
      await this.mailerService.sendWithTemplate(
        user.email,
        'Demande de suppression de compte',
        {},
        'delete-account'
      )
    } catch (e) {
      Logger.error(e)
    }

    delete user.password
    delete user.tokens

    return user
  }
}
