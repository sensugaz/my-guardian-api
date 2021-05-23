import { EntityRepository, Repository } from 'typeorm'
import { ConfigModel } from '@my-guardian-api/database'

@EntityRepository(ConfigModel)
export class ConfigRepository extends Repository<ConfigModel> {

}