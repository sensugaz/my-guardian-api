import { EntityRepository } from 'typeorm'
import { BaseModel, VoucherHistoryModel } from '@my-guardian-api/database'

@EntityRepository(VoucherHistoryModel)
export class VoucherHistoryRepository extends BaseModel {
  
}