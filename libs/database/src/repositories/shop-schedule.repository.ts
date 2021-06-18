import { EntityRepository, Repository } from 'typeorm'
import { ShopScheduleModel } from '@my-guardian-api/database'

@EntityRepository(ShopScheduleModel)
export class ShopScheduleRepository extends Repository<ShopScheduleModel> {}
