import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateCustomerCommand } from '../command'
import {
  CustomerModel,
  RoleModel,
  UserModel,
  UserTokenModel,
} from '@my-guardian-api/database'
import { ApiException, RoleEnum, TokenTypeEnum } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'
import { uid } from 'rand-token'
import * as bcrypt from 'bcrypt'
import { EntityManager } from 'typeorm'

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler
  implements ICommandHandler<CreateCustomerCommand> {
  constructor(private readonly entityManager: EntityManager) {}

  async execute({ body }: CreateCustomerCommand): Promise<UserModel> {
    const emailExists = await this.entityManager.findOne(UserModel, {
      email: body.email,
    })

    if (emailExists) {
      throw new ApiException({
        type: 'application',
        module: 'customer',
        codes: ['email_is_exists'],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }

    const tokenModel = this.entityManager.create(UserTokenModel, {
      token: uid(100),
      type: TokenTypeEnum.REGISTER,
    })

    const role = await this.entityManager.findOne(RoleModel, {
      key: RoleEnum.CUSTOMER,
    })

    if (!role) {
      throw new ApiException({
        type: 'application',
        module: 'customer',
        codes: ['role_not_found'],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }

    const salt = await bcrypt.genSalt(15)
    const password = await bcrypt.hash(body.password, salt)

    const userModel = this.entityManager.create(UserModel, {
      email: body.email,
      password: password,
      salt: salt,
      isActivate: true,
      role: role,
    })

    userModel.addToken(tokenModel)

    const user = await this.entityManager.save(UserModel, userModel)

    const customerModel = this.entityManager.create(CustomerModel, {
      userId: user.id,
      firstName: body.firstName,
      lastName: body.lastName,
      phoneCode: body.phoneCode,
      phoneNumber: body.phoneNumber,
    })

    await this.entityManager.save(CustomerModel, customerModel)

    user['profile'] = customerModel
    delete user.password
    delete user.salt
    delete user.tokens

    return user
  }
}
