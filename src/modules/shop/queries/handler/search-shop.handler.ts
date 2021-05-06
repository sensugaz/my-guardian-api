import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { SearchShopQuery } from '../query'
import { ConfigModel, ShopModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import { GoogleMapService } from '@my-guardian-api/google-map'

@QueryHandler(SearchShopQuery)
export class SearchShopHandler implements IQueryHandler<SearchShopQuery> {
  constructor(private readonly entityManager: EntityManager,
              private readonly googleMapService: GoogleMapService) {
  }

  async execute({ body }: SearchShopQuery): Promise<ShopModel[]> {
    const config = await this.entityManager.findOne(ConfigModel)
    const shops = await this.entityManager.find(ShopModel)
    const shopInArea: ShopModel[] = []

    for (const shop of shops) {
      const distance = await this.googleMapService.distance(body.geolocation, shop.geolocation)

      if (distance > 0) {
        const km = Math.ceil(distance / 1000)

        if (km < (config?.searchRadius || 10)) {
          shopInArea.push(shop)
        }
      }
    }

    return shopInArea
  }
}