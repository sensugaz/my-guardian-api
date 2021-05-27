import { IQuery } from '@nestjs/cqrs'
import { UserModel } from '@my-guardian-api/database'

export class CheckVoucherQuery implements IQuery {
  constructor(public readonly user: UserModel, public readonly code: string) {}
}
