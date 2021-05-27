import { EntityRepository, Repository } from 'typeorm'
import { CustomerModel } from '@my-guardian-api/database'

@EntityRepository(CustomerModel)
export class CustomerRepository extends Repository<CustomerModel> {}
