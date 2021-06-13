import { EntityRepository, Repository } from 'typeorm'
import { ShopModel } from '@my-guardian-api/database'

@EntityRepository(ShopModel)
export class ShopRepository extends Repository<ShopModel> {
  findOneWithDelete(id: string): Promise<ShopModel> {
    return this.findOne(id, {
      withDeleted: true
    })
  }
}
