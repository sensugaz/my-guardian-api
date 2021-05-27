import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteShopCommand } from '../command'
import { EntityManager } from 'typeorm'
import { ShopModel, UserModel, UserTokenModel } from '@my-guardian-api/database'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@CommandHandler(DeleteShopCommand)
export class DeleteShopHandler implements ICommandHandler<DeleteShopCommand> {
  constructor(private readonly entityManager: EntityManager) {}

  async execute({ userId }: DeleteShopCommand): Promise<UserModel> {
    const user = await this.entityManager.findOne(
      UserModel,
      {
        id: userId,
      },
      {
        withDeleted: true,
      },
    )

    if (!user) {
      throw new ApiException({
        type: 'application',
        module: 'shop',
        codes: ['shop_not_found'],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }

    const shop = await this.entityManager.findOne(ShopModel, {
      userId: user.id,
    })

    if (!shop) {
      throw new ApiException({
        type: 'application',
        module: 'shop',
        codes: ['shop_not_found'],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }

    await this.entityManager.remove([...shop.schedules, ...shop.prices])
    await this.entityManager.remove(shop)
    await this.entityManager.delete(UserTokenModel, {
      user: user,
    })
    await this.entityManager.remove(user)

    delete user.password
    delete user.salt

    return user
  }
}
