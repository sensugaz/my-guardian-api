import { EntityRepository, Repository } from 'typeorm'
import { VoucherHistoryModel } from '@my-guardian-api/database'

@EntityRepository(VoucherHistoryModel)
export class VoucherHistoryRepository extends Repository<VoucherHistoryModel> {}
