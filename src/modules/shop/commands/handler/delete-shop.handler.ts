import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteShopCommand } from '../command'
import { UserModel } from '@my-guardian-api/database'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  ShopPriceRepository,
  ShopRepository,
  ShopScheduleRepository,
  UserRepository,
  UserTokenRepository
} from '@my-guardian-api/database/repositories'

@CommandHandler(DeleteShopCommand)
export class DeleteShopHandler implements ICommandHandler<DeleteShopCommand> {
  constructor(@InjectRepository(UserRepository)
              private readonly userRepository: UserRepository,
              @InjectRepository(UserTokenRepository)
              private readonly userTokenRepository: UserTokenRepository,
              @InjectRepository(ShopRepository)
              private readonly shopRepository: ShopRepository,
              @InjectRepository(ShopPriceRepository)
              private readonly shopPriceRepository: ShopPriceRepository,
              @InjectRepository(ShopScheduleRepository)
              private readonly shopScheduleRepository: ShopScheduleRepository) {
  }

  async execute({ userId }: DeleteShopCommand): Promise<UserModel> {
    const user = await this.userRepository.findOne(
      {
        id: userId
      },
      {
        withDeleted: true
      }
    )

    if (!user) {
      throw new ApiException({
        type: 'application',
        module: 'shop',
        codes: ['shop_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const shop = await this.shopRepository.findOne({
      userId: user.id
    })

    if (!shop) {
      throw new ApiException({
        type: 'application',
        module: 'shop',
        codes: ['shop_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    await this.shopPriceRepository.remove([...shop.prices])
    await this.shopScheduleRepository.remove([...shop.schedules])
    await this.shopRepository.softRemove(shop)
    await this.userTokenRepository.delete({
      user: user
    })
    await this.userRepository.remove(user)

    delete user.password
    delete user.salt

    return user
  }
}
