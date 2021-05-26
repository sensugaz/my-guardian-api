import { EntityRepository, Repository } from 'typeorm'
import { VoucherModel } from '@my-guardian-api/database'

@EntityRepository(VoucherModel)
export class VoucherRepository extends Repository<VoucherModel> {

}