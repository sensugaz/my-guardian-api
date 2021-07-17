import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateShopCommand } from '../command'
import { UserModel } from '@my-guardian-api/database'
import { ApiException, RoleEnum } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleRepository, ShopRepository, UserRepository } from '@my-guardian-api/database/repositories'

@CommandHandler(CreateShopCommand)
export class CreateShopHandler implements ICommandHandler<CreateShopCommand> {
  constructor(@InjectRepository(UserRepository)
              private readonly userRepository: UserRepository,
              @InjectRepository(ShopRepository)
              private readonly shopRepository: ShopRepository,
              @InjectRepository(RoleRepository)
              private readonly roleRepository: RoleRepository) {
  }

  async execute({ body }: CreateShopCommand): Promise<UserModel> {
    const emailExists = await this.userRepository.findOne({
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

    const role = await this.roleRepository.findOne({
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

    const user = await this.userRepository.save(this.userRepository.create({
      email: body.email,
      password: password,
      salt: salt,
      isActivate: true,
      role: role
    }))

    user['profile'] = await this.shopRepository.save(this.shopRepository.create({
      userId: user.id,
      available: 0
    }))

    delete user.password
    delete user.salt

    return user
  }
}
