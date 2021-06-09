import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteUserCommand } from '../command'
import { MailerService } from '@my-guardian-api/mailer'
import { EntityManager } from 'typeorm'
import { UserModel } from '@my-guardian-api/database'

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly mailerService: MailerService,
  ) {}

  async execute({ user }: DeleteUserCommand): Promise<any> {
    user.inActivate()
    await this.entityManager.save(UserModel, user)
    await this.entityManager.softRemove(user)
    await this.mailerService.sendWithTemplate(
      user.email,
      'Demande de suppression de compte',
      {},
      'delete-account',
    )

    delete user.password
    delete user.tokens

    return user
  }
}
