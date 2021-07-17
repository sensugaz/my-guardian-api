import { EntityRepository, Repository } from 'typeorm'
import { UserTokenModel } from '@my-guardian-api/database'

@EntityRepository(UserTokenModel)
export class UserTokenRepository extends Repository<UserTokenModel> {

}
