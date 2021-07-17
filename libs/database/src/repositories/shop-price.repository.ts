import { EntityRepository, Repository } from 'typeorm'
import { ShopPriceModel } from '@my-guardian-api/database'

@EntityRepository(ShopPriceModel)
export class ShopPriceRepository extends Repository<ShopPriceModel> {

}
