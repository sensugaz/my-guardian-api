import { IQuery } from '@nestjs/cqrs'
import { OrderByEnum } from '@my-guardian-api/common'
import { IPaginationOptions } from 'nestjs-typeorm-paginate'

export class GetVoucherQuery implements IQuery {
  constructor(
    public readonly query: string,
    public readonly sort: string,
    public readonly orderBy: OrderByEnum,
    public readonly options: IPaginationOptions,
  ) {}
}
