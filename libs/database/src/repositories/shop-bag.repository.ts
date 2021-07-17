import { EntityRepository, Repository } from 'typeorm'
import { ShopBagModel } from '@my-guardian-api/database'

@EntityRepository(ShopBagModel)
export class ShopBagRepository extends Repository<ShopBagModel> {

}
