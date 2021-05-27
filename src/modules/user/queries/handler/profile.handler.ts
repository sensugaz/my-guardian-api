import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ProfileQuery } from '../query'
import { CustomerModel, UserModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import { RoleEnum } from '@my-guardian-api/common'

@QueryHandler(ProfileQuery)
export class ProfileHandler implements IQueryHandler<ProfileQuery> {
  constructor(private readonly entityManager: EntityManager) {}

  async execute({ user }: ProfileQuery): Promise<UserModel> {
    let profile: any = {}
    switch (user?.role?.key) {
      case RoleEnum.CUSTOMER:
        profile = await this.entityManager.findOne(CustomerModel, {
          userId: user.id,
        })
        break
    }

    user['profile'] = profile

    delete user.password
    delete user.salt

    return user
  }
}
