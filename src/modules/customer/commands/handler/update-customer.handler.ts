import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateCustomerCommand } from '../command'
import { EntityManager } from 'typeorm'
import { CustomerModel } from '@my-guardian-api/database'

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateCustomerCommand> {
  constructor(private readonly entityManager: EntityManager) {
  }

  async execute({ body }: UpdateCustomerCommand): Promise<CustomerModel> {
    return Promise.resolve(undefined)
  }
}