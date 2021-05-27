import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateProfileCommand } from '../command'
import { EntityManager } from 'typeorm'
import { CustomerModel, UserModel } from '@my-guardian-api/database'
import { ApiException } from '@my-guardian-api/common'

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements ICommandHandler<UpdateProfileCommand> {
  constructor(private readonly entityManager: EntityManager) {}

  async execute({ user, body }: UpdateProfileCommand): Promise<UserModel> {
    const customer = await this.entityManager.findOne(CustomerModel, {
      userId: user.id,
    })

    if (!customer) {
      throw new ApiException({
        module: 'user',
        type: 'application',
        codes: ['customer_not_found'],
        statusCode: 400,
      })
    }

    customer.updateProfile({
      firstName: body.firstName,
      lastName: body.lastName,
      phoneCode: body.phoneCode,
      phoneNumber: body.phoneNumber,
    })

    await this.entityManager.save(customer)

    user['profile'] = customer

    delete user.password
    delete user.salt

    return user
  }
}
