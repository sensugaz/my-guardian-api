import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateShopCommand } from '../command'
import { EntityManager } from 'typeorm'
import { RoleModel, ShopModel, UserModel } from '@my-guardian-api/database'
import { ApiException, RoleEnum } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@CommandHandler(CreateShopCommand)
export class CreateShopHandler implements ICommandHandler<CreateShopCommand> {
  constructor(private readonly entityManager: EntityManager) {
  }

  async execute({ body }: CreateShopCommand): Promise<UserModel> {
    const emailExists = await this.entityManager.findOne(UserModel, {
      email: body.email
    })

    if (emailExists) {
      throw new ApiException({
        type: 'application',
        module: 'shop',
        codes: ['email_is_exists'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const role = await this.entityManager.findOne(RoleModel, {
      key: RoleEnum.SHOP
    })

    if (!role) {
      throw new ApiException({
        type: 'application',
        module: 'shop',
        codes: ['role_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const salt = await bcrypt.genSalt(15)
    const password = await bcrypt.hash(body.password, salt)

    const userModel = this.entityManager.create(UserModel, {
      email: body.email,
      password: password,
      salt: salt,
      isActivate: true,
      role: role
    })

    const user = await this.entityManager.save(UserModel, userModel)

    const shopModel = this.entityManager.create(ShopModel, {
      userId: user.id,
      available: 0
    })

    user['profile'] = await this.entityManager.save(ShopModel, shopModel)

    delete user.password
    delete user.salt

    return user
  }
}