import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetShopByIdQuery } from '../query'
import { ShopModel, UserModel } from '@my-guardian-api/database'
import { ApiException, RoleEnum } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from '@my-guardian-api/database/repositories'

@QueryHandler(GetShopByIdQuery)
export class GetShopByIdHandler implements IQueryHandler<GetShopByIdQuery> {
  constructor(@InjectRepository(UserRepository)
              private readonly userRepository: UserRepository) {
  }

  async execute({ userId }: GetShopByIdQuery): Promise<UserModel> {
    const result = await this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.role', 'roles')
      .innerJoinAndMapOne(
        'users.profile',
        ShopModel,
        'shops',
        'users.id = shops.user_id'
      )
      .leftJoinAndSelect('shops.schedules', 'schedules')
      .leftJoinAndSelect('shops.prices', 'prices')
      .where('roles.key = :role', { role: RoleEnum.CUSTOMER })
      .where('users.id = :userId', { userId })
      .withDeleted()
      .getOne()

    if (!result) {
      throw new ApiException({
        type: 'application',
        module: 'customer',
        codes: ['customer_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    delete result.password
    delete result.salt

    return result
  }
}
