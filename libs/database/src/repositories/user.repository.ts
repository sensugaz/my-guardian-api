import { EntityRepository, Repository } from 'typeorm'
import { UserModel } from '@my-guardian-api/database'

@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel> {

}