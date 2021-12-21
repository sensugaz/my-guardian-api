import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { Cache } from 'cache-manager'
import { InjectRepository } from '@nestjs/typeorm'
import { ShopRepository } from '@my-guardian-api/database/repositories'
import { ShopModel } from '@my-guardian-api/database'
import { IsNull, Not } from 'typeorm'

@Injectable()
export class ShopService {
  constructor(@Inject(CACHE_MANAGER)
              private readonly cacheManager: Cache,
              @InjectRepository(ShopRepository)
              private readonly shopRepository: ShopRepository) {
  }

  @Cron('60 * * * * *')
  async handleCron() {
    const cache: ShopModel[] = await this.cacheManager.get('shops')

    if (cache === undefined) {
      const data = await this.shopRepository.find({
        where: {
          geolocation: Not(IsNull())
        }
      })

      await this.cacheManager.set('shops', data)

      console.log('load data shops to cache')
    }
  }
}