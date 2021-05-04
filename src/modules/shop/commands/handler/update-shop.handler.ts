import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateShopCommand } from '../command'
import { ShopModel, ShopPriceModel, ShopScheduleModel, UserModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@CommandHandler(UpdateShopCommand)
export class UpdateShopHandler implements ICommandHandler<UpdateShopCommand> {
  constructor(private readonly entityManager: EntityManager) {
  }

  async execute({ userId, body }: UpdateShopCommand): Promise<UserModel> {
    const user = await this.entityManager.findOne(UserModel, {
      id: userId
    })

    if (!user) {
      throw new ApiException({
        type: 'application',
        module: 'shop',
        codes: ['shop_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    let shop = await this.entityManager.findOne(ShopModel, {
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

    shop.updateProfile({
      name: body.name,
      address: body.address,
      geolocation: body.geolocation,
      available: body.available
    })

    await this.entityManager.remove([...shop.schedules, ...shop.prices])

    for (const schedule of body.schedules) {
      const scheduleModel = this.entityManager.create(ShopScheduleModel, {
        day: schedule.day,
        openTime: !schedule.isClose ? schedule.openTime : null,
        closeTime: !schedule.isClose ? schedule.closeTime : null,
        isClose: schedule.isClose
      })

      shop.addSchedule(scheduleModel)
    }

    for (const price of body.prices) {
      const priceModel = this.entityManager.create(ShopPriceModel, {
        name: price.name,
        price: price.price
      })

      shop.addPrice(priceModel)
    }

    shop = await this.entityManager.save(shop)

    await this.entityManager.delete(ShopScheduleModel, {
      shop: null
    })

    await this.entityManager.delete(ShopPriceModel, {
      shop: null
    })

    user['profile'] = shop

    delete user.password
    delete user.salt

    return user
  }
}