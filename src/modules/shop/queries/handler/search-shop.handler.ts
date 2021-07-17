import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { SearchShopQuery } from '../query'
import { ShopModel } from '@my-guardian-api/database'
import { GoogleMapService } from '@my-guardian-api/google-map'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigRepository, ShopRepository } from '@my-guardian-api/database/repositories'

@QueryHandler(SearchShopQuery)
export class SearchShopHandler implements IQueryHandler<SearchShopQuery> {
  constructor(
    @InjectRepository(ConfigRepository)
    private readonly configRepository: ConfigRepository,
    @InjectRepository(ShopRepository)
    private readonly shopRepository: ShopRepository,
    private readonly googleMapService: GoogleMapService
  ) {
  }

  async execute({ body }: SearchShopQuery): Promise<ShopModel[]> {
    const config = await this.configRepository.findOne()
    const shops = await this.shopRepository.find()
    const shopInArea: ShopModel[] = []

    for (const shop of shops) {
      if (shop?.geolocation?.lat && shop?.geolocation?.lng) {
        const distance = await this.googleMapService.distance(
          body.geolocation,
          shop.geolocation
        )

        if (distance >= 0) {
          const km = distance / 1000

          if (km < (config?.searchRadius || 10)) {
            shop['distance'] = Number(km.toFixed(2))
            shopInArea.push(shop)
          }
        }
      }
    }

    return shopInArea
  }
}
