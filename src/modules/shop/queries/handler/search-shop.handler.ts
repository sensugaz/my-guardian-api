import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { SearchShopQuery } from '../query'
import { ShopModel } from '@my-guardian-api/database'
import { GoogleMapService } from '@my-guardian-api/google-map'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigRepository, ShopRepository } from '@my-guardian-api/database/repositories'
import { IsNull, Not } from 'typeorm'
import getDistance from 'geolib/es/getDistance'

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
    const shops = await this.shopRepository.find({
      where: {
        geolocation: Not(IsNull())
      }
    })

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

    // const paginate = ArrayUtil.paginate(shops, 100)
    //
    // for (const page in paginate.data) {
    //   const shopPaginate = paginate.data[page]
    //   const destinations: { lat: string, lng: string }[] = shopPaginate.map(i => {
    //     if (i?.geolocation?.lat && i?.geolocation?.lng) {
    //       return {
    //         lat: i.geolocation.lat,
    //         lng: i.geolocation.lng
    //       }
    //     }
    //   })
    //
    //   if (destinations.length > 0) {
    //     const matrix = await this.googleMapService.distanceMatrix(
    //       [body.geolocation],
    //       [...destinations]
    //     )
    //
    //     if (matrix.status === 'OK') {
    //       if (matrix.rows.length > 0) {
    //         matrix.rows[0].elements.forEach((value, index) => {
    //           if (value.status === 'OK') {
    //             const distance = value.distance?.value
    //
    //             if (distance >= 0) {
    //               const km = distance / 1000
    //               const shop = shops[index]
    //
    //               if (km < (config?.searchRadius || 10)) {
    //                 shop['distance'] = Number(km.toFixed(2))
    //                 shopInArea.push(shop)
    //               }
    //             }
    //           }
    //         })
    //       }
    //     }
    //   }
    // }

    return shopInArea
  }
}
