import { IQuery } from '@nestjs/cqrs'
import { UserModel } from '@my-guardian-api/database'

export class ProfileQuery implements IQuery {
  constructor(public readonly user: UserModel) {}
}
