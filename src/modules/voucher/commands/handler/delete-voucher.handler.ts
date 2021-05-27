import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DeleteVoucherCommand } from '../command'
import { VoucherModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@CommandHandler(DeleteVoucherCommand)
export class DeleteVoucherHandler
  implements ICommandHandler<DeleteVoucherCommand> {
  constructor(private readonly entityManager: EntityManager) {}

  async execute({ id }: DeleteVoucherCommand): Promise<VoucherModel> {
    const voucher = await this.entityManager.findOne(VoucherModel, {
      id: id,
    })

    if (!voucher) {
      throw new ApiException({
        type: 'application',
        module: 'voucher',
        codes: ['voucher_not_found'],
        statusCode: HttpStatus.BAD_REQUEST,
      })
    }

    await this.entityManager.remove(voucher)

    return voucher
  }
}
