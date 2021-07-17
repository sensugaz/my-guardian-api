import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateBagCommand } from '../command'
import { ShopModel } from '@my-guardian-api/database'
import { ShopBagRepository, ShopRepository, UserRepository } from '@my-guardian-api/database/repositories'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiException, ShopBagStatusEnum } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@CommandHandler(CreateBagCommand)
export class CreateBagHandler implements ICommandHandler<CreateBagCommand> {
  constructor(@InjectRepository(UserRepository)
              private readonly userRepository: UserRepository,
              @InjectRepository(ShopRepository)
              private readonly shopRepository: ShopRepository,
              @InjectRepository(ShopBagRepository)
              private readonly shopBagRepository: ShopBagRepository) {
  }

  async execute({ userId, body }: CreateBagCommand): Promise<ShopModel> {
    const user = await this.userRepository.findOne({ id: userId })

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

    if (shop.bags) {
      const bagExists = shop.bags.find(i => i.number === body.number)

      if (bagExists) {
        throw new ApiException({
          type: 'application',
          module: 'shop',
          codes: ['bag_is_exists'],
          statusCode: HttpStatus.BAD_REQUEST
        })
      }
    }

    shop.bags.push(await this.shopBagRepository.create({
      number: body.number,
      status: ShopBagStatusEnum.AVAILABLE
    }))

    return await this.shopRepository.save(shop)
  }

}
