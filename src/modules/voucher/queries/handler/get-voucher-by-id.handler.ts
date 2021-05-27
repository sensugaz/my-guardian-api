import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { GetVoucherByIdQuery } from '../query'
import { VoucherModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'

@QueryHandler(GetVoucherByIdQuery)
export class GetVoucherByIdHandler
  implements IQueryHandler<GetVoucherByIdQuery> {
  constructor(private readonly entityManager: EntityManager) {}

  async execute({ id }: GetVoucherByIdQuery): Promise<VoucherModel> {
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

    return voucher
  }
}
