import { IQuery } from '@nestjs/cqrs'
import { OrderByEnum } from '@my-guardian-api/common'
import { IPaginationOptions } from 'nestjs-typeorm-paginate'
import { UserModel } from '@my-guardian-api/database'

export class GetBookingQuery implements IQuery {
  constructor(
    public readonly user: UserModel,
    public readonly query: string,
    public readonly sort: string,
    public readonly orderBy: OrderByEnum,
    public readonly options: IPaginationOptions
  ) {
  }
}