import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetCustomerByIdQuery } from '../query'
import { CustomerModel, UserModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import { ApiException, RoleEnum } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@QueryHandler(GetCustomerByIdQuery)
export class GetCustomerByIdHandler
  implements IQueryHandler<GetCustomerByIdQuery> {
  constructor(private readonly entityManager: EntityManager) {}

  async execute({ userId }: GetCustomerByIdQuery): Promise<UserModel> {
    const result = await this.entityManager
      .getRepository(UserModel)
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.role', 'roles')
      .innerJoinAndMapOne(
        'users.profile',
        CustomerModel,
        'customers',
        'users.id = customers.user_id',
      )
      .where('roles.key = :role', { role: RoleEnum.CUSTOMER })
      .where('users.id = :userId', { userId })
      .withDeleted()
      .getOne()

    if (!result) {
      throw new ApiException({
        type: 'application',
        module: 'customer',
        codes: ['customer_not_found'],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }

    delete result.password
    delete result.salt

    return result
  }
}
