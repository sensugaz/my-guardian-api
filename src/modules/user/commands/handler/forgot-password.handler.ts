import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ForgotPasswordCommand } from '../command'
import { EntityManager } from 'typeorm'
import { UserModel, UserTokenModel } from '@my-guardian-api/database'
import { ApiException, TokenTypeEnum } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'
import { uid } from 'rand-token'
import * as moment from 'moment'
import { MailerService } from '@my-guardian-api/mailer'
import { ConfigService } from '@nestjs/config'

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {
  constructor(private readonly entityManager: EntityManager,
              private readonly mailerService: MailerService,
              private readonly configService: ConfigService) {
  }

  async execute({ body }: ForgotPasswordCommand): Promise<UserModel> {
    const user = await this.entityManager.findOne(UserModel, {
      email: body.email
    }, {
      order: {
        createDate: 'DESC'
      },
      relations: ['tokens']
    })

    if (!user) {
      throw new ApiException({
        type: 'application',
        module: 'user',
        codes: ['email_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const tokenEntity = this.entityManager.create(UserTokenModel, {
      token: uid(100),
      type: TokenTypeEnum.FORGOT_PASSWORD,
      expiredAt: moment().utc().add(30, 'minute').toDate()
    })

    user.addToken(tokenEntity)
    await this.entityManager.save(UserModel, user)

    await this.mailerService.sendWithTemplate(user.email, 'Demande de réinitialisation du mot de passe', {
      url: `${this.configService.get<string>('BASE_URL')}/auth/redirect?type=forgot-password&token=${tokenEntity.token}`
    }, 'forgot-password')

    delete user.password
    delete user.salt
    delete user.tokens

    return user
  }
}