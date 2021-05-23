import { EntityRepository, Repository } from 'typeorm'
import { RoleModel } from '@my-guardian-api/database'

@EntityRepository(RoleModel)
export class RoleRepository extends Repository<RoleModel> {

}