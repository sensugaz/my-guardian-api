import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UpdateVoucherCommand } from '../command'
import { VoucherModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@CommandHandler(UpdateVoucherCommand)
export class UpdateVoucherHandler
  implements ICommandHandler<UpdateVoucherCommand> {
  constructor(private readonly entityManager: EntityManager) {}

  async execute({ id, body }: UpdateVoucherCommand): Promise<VoucherModel> {
    let voucher = await this.entityManager.findOne(VoucherModel, {
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

    voucher.updateVoucher(body.name, body.description, body.percent)

    voucher = await this.entityManager.save(VoucherModel, voucher)

    return voucher
  }
}
