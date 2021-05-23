import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { VoucherHistoryModel, VoucherModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import { ApiException, OrderByEnum } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'
import { CheckVoucherQuery } from '../query'

@QueryHandler(CheckVoucherQuery)
export class CheckVoucherHandler implements IQueryHandler<CheckVoucherQuery> {
  constructor(public readonly entityManager: EntityManager) {
  }

  async execute(query: CheckVoucherQuery): Promise<VoucherModel> {
    const voucher = await this.entityManager.findOne(VoucherModel, {
      code: query.code.toLocaleUpperCase()
    }, {
      order: {
        createdDate: OrderByEnum.DESC
      }
    })

    if (!voucher) {
      throw new ApiException({
        type: 'application',
        module: 'voucher',
        codes: ['voucher_not_found'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    const history = await this.entityManager.findOne(VoucherHistoryModel, {
      user: query.user,
      code: query.code
    })

    if (history) {
      throw new ApiException({
        type: 'application',
        module: 'voucher',
        codes: ['voucher_has_been_used'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    return voucher
  }
}