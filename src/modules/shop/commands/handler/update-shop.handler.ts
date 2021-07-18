import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateShopCommand } from '../command'
import { UserModel } from '@my-guardian-api/database'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  ShopPriceRepository,
  ShopRepository,
  ShopScheduleRepository,
  UserRepository
} from '@my-guardian-api/database/repositories'

@CommandHandler(UpdateShopCommand)
export class UpdateShopHandler implements ICommandHandler<UpdateShopCommand> {
  constructor(@InjectRepository(UserRepository)
              private readonly userRepository: UserRepository,
              @InjectRepository(ShopRepository)
              private readonly shopRepository: ShopRepository,
              @InjectRepository(ShopPriceRepository)
              private readonly shopPriceRepository: ShopPriceRepository,
              @InjectRepository(ShopScheduleRepository)
              private readonly shopScheduleRepository: ShopScheduleRepository) {
  }

  async execute({ userId, body }: UpdateShopCommand): Promise<UserModel> {
    const user = await this.userRepository.findOne({
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

    let shop = await this.shopRepository.findOne({
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
      description: body.description,
      available: body.available
    })

    shop.clearSchedules()
    shop.clearPrices()

    shop = await this.shopRepository.save(shop)

    await this.shopPriceRepository.delete({
      shop: null
    })
    await this.shopScheduleRepository.delete({
      shop: null
    })

    for (const schedule of body.schedules) {
      const scheduleModel = this.shopScheduleRepository.create({
        day: schedule.day,
        openTime: !schedule.isClose ? schedule.openTime : null,
        closeTime: !schedule.isClose ? schedule.closeTime : null,
        openTimeEnd: !schedule.openTimeEnd ? schedule.openTimeEnd : null,
        closeTimeStart: !schedule.closeTimeStart ? schedule.closeTimeStart : null,
        isClose: schedule.isClose
      })

      shop.addSchedule(scheduleModel)
    }

    for (const price of body.prices) {
      const priceModel = this.shopPriceRepository.create({
        name: price.name,
        price: price.price,
        qty: price.qty
      })

      shop.addPrice(priceModel)
    }

    shop = await this.shopRepository.save(shop)

    user['profile'] = shop

    delete user.password
    delete user.salt

    return user
  }
}
