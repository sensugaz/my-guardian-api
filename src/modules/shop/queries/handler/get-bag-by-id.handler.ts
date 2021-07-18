import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetBagByIdQuery } from '../query'
import { ShopBagModel } from '@my-guardian-api/database'
import { InjectRepository } from '@nestjs/typeorm'
import { ShopRepository, UserRepository } from '@my-guardian-api/database/repositories'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@QueryHandler(GetBagByIdQuery)
export class GetBagByIdHandler implements IQueryHandler<GetBagByIdQuery> {
  constructor(@InjectRepository(UserRepository)
              private readonly userRepository: UserRepository,
              @InjectRepository(ShopRepository)
              private readonly shopRepository: ShopRepository) {
  }

  async execute({ userId, bagId }: GetBagByIdQuery): Promise<ShopBagModel> {
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

    const bag = shop.bags.find(x => x.id === bagId)

    if (!bag) {
      throw new ApiException({
        type: 'application',
        module: 'shop',
        codes: ['bag_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    return bag
  }
}
