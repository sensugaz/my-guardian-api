import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { CreateVoucherCommand } from '../command'
import { VoucherModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@CommandHandler(CreateVoucherCommand)
export class CreateVoucherHandler
  implements ICommandHandler<CreateVoucherCommand> {
  constructor(private readonly entityManager: EntityManager) {}

  async execute({ body }: CreateVoucherCommand): Promise<VoucherModel> {
    const voucherModel = this.entityManager.create(VoucherModel, {
      code: body.code.toLocaleUpperCase(),
      name: body.name,
      description: body.description,
      percent: body.percent,
    })

    const codeExists = await this.entityManager.findOne(VoucherModel, {
      code: body.code,
    })

    if (codeExists) {
      throw new ApiException({
        type: 'application',
        module: 'voucher',
        codes: ['code_is_exists'],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }

    return await this.entityManager.save(VoucherModel, voucherModel)
  }
}
