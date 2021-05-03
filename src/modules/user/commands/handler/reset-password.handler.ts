import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ResetPasswordCommand } from '../command'
import { MailerService } from '@my-guardian-api/mailer'
import { EntityManager } from 'typeorm'
import { UserTokenModel } from '@my-guardian-api/database'
import { ApiException, TokenTypeEnum } from '@my-guardian-api/common'
import * as bcrypt from 'bcrypt'

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(private readonly entityManager: EntityManager,
              private readonly mailerService: MailerService) {
  }

  async execute({ query, body }: ResetPasswordCommand): Promise<any> {
    const token = await this.entityManager.findOne(UserTokenModel, {
      token: query.token,
      type: TokenTypeEnum.FORGOT_PASSWORD
    }, {
      order: {
        createdDate: 'ASC'
      },
      relations: ['user']
    })

    if (!token) {
      throw new ApiException({
        module: 'user',
        type: 'application',
        codes: ['token_not_found'],
        statusCode: 400
      })
    }

    if (!token.user) {
      throw new ApiException({
        module: 'user',
        type: 'application',
        codes: ['user_not_found'],
        statusCode: 400
      })
    }

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(body.password, salt)

    token.usedToken()
    token.user.changePassword(password, salt)

    token.isExpired()

    await this.entityManager.save(token)
    await this.entityManager.save(token.user)

    await this.mailerService.sendWithTemplate(token.user.email, 'Confirmation de changement du mot de passe', {}, 'reset-password')

    delete token.user.password
    delete token.user.salt

    return token.user
  }

}