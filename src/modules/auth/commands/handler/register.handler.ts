import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RegisterCommand } from '../command'
import { CustomerModel, RoleModel, UserModel, UserTokenModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import { ApiException, RoleEnum, TokenTypeEnum } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'
import { uid } from 'rand-token'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import { MailerService } from '@my-guardian-api/mailer'

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(private readonly entityManager: EntityManager,
              private readonly configService: ConfigService,
              private readonly mailerService: MailerService) {
  }

  async execute({ body }: RegisterCommand): Promise<UserModel> {
    const emailExists = await this.entityManager.findOne(UserModel, {
      email: body.email
    })

    if (emailExists) {
      throw new ApiException({
        type: 'application',
        module: 'auth',
        codes: ['email_is_exists'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const tokenModel = this.entityManager.create(UserTokenModel, {
      token: uid(100),
      type: TokenTypeEnum.REGISTER
    })

    const role = await this.entityManager.findOne(RoleModel, {
      key: RoleEnum.CUSTOMER
    })

    if (!role) {
      throw new ApiException({
        type: 'application',
        module: 'auth',
        codes: ['role_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const salt = await bcrypt.genSalt(15)
    const password = await bcrypt.hash(body.password, salt)

    const userModel = await this.entityManager.create(UserModel, {
      email: body.email,
      password: password,
      salt: salt,
      isActivate: false,
      role: role
    })

    userModel.addToken(tokenModel)

    const user = await this.entityManager.save(UserModel, userModel)

    const customerModel = await this.entityManager.create(CustomerModel, {
      userId: user.id,
      firstName: body.firstName,
      lastName: body.lastName,
      phoneCode: body.phoneCode,
      phoneNumber: body.phoneNumber
    })

    await this.entityManager.save(CustomerModel, customerModel)

    await this.mailerService.sendWithTemplate(user.email, 'Confirmation d’inscription', {
      url: `${this.configService.get<string>('BASE_URL')}/auth/redirect?type=register&token=${tokenModel.token}`
    }, 'register')

    delete user.password
    delete user.salt
    delete user.tokens

    return user
  }
}