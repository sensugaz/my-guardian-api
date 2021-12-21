import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { SearchShopQuery } from '../query'
import { ShopModel } from '@my-guardian-api/database'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigRepository, ShopRepository } from '@my-guardian-api/database/repositories'
import { CACHE_MANAGER, Inject } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { IsNull, Not } from 'typeorm'
import getDistance from 'geolib/es/getDistance'

@QueryHandler(SearchShopQuery)
export class SearchShopHandler implements IQueryHandler<SearchShopQuery> {
  constructor(
    @InjectRepository(ConfigRepository)
    private readonly configRepository: ConfigRepository,
    @InjectRepository(ShopRepository)
    private readonly shopRepository: ShopRepository,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache) {
  }

  async execute({ body }: SearchShopQuery): Promise<ShopModel[]> {
    const config = await this.configRepository.findOne()

    let shops: ShopModel[];

    const cache: ShopModel[] = await this.cacheManager.get('shops')

    if (cache === undefined) {
      const data = await this.shopRepository.find({
        where: {
          geolocation: Not(IsNull())
        }
      })

      await this.cacheManager.set('shops', data)
      shops = data
    } else {
      shops = cache
    }

    const shopInArea: ShopModel[] = []

    shops.forEach(shop => {
      const distance = getDistance(
        { latitude: body.geolocation.lat, longitude: body.geolocation.lng },
        { latitude: shop.geolocation.lat, longitude: shop.geolocation.lng }
      )

      if (distance > 0) {
        const km = distance / 1000
        if (km < (config?.searchRadius || 10)) {
          shop['distance'] = Number(km.toFixed(2))
          shopInArea.push(shop)
        }
      }
    })

    return shopInArea
  }
}
