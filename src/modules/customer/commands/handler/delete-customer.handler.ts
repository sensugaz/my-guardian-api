import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteCustomerCommand } from '../command'
import { EntityManager } from 'typeorm'
import {
  CustomerModel,
  UserModel,
  UserTokenModel,
} from '@my-guardian-api/database'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@CommandHandler(DeleteCustomerCommand)
export class DeleteCustomerHandler
  implements ICommandHandler<DeleteCustomerCommand> {
  constructor(private readonly entityManager: EntityManager) {}

  async execute({ userId }: DeleteCustomerCommand): Promise<UserModel> {
    const user = await this.entityManager.findOne(
      UserModel,
      {
        id: userId,
      },
      {
        withDeleted: true,
      },
    )

    if (!user) {
      throw new ApiException({
        type: 'application',
        module: 'customer',
        codes: ['customer_not_found'],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }

    await this.entityManager.delete(CustomerModel, {
      userId: user.id,
    })
    await this.entityManager.delete(UserTokenModel, {
      user: user,
    })
    await this.entityManager.remove(user)

    delete user.password
    delete user.salt

    return user
  }
}
