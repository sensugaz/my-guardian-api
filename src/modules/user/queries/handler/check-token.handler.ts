import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { CheckTokenQuery } from '../query'
import { UserTokenModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import { ApiException } from '@my-guardian-api/common'

@QueryHandler(CheckTokenQuery)
export class CheckTokenHandler implements IQueryHandler<CheckTokenQuery> {
  constructor(private readonly entityManager: EntityManager) {}

  async execute({ query }: CheckTokenQuery): Promise<UserTokenModel> {
    const token = await this.entityManager.findOne(UserTokenModel, {
      token: query.token,
    })

    if (!token) {
      throw new ApiException({
        module: 'user',
        type: 'application',
        codes: ['token_not_found'],
        statusCode: 400,
      })
    }

    token.isUsed()
    token.isExpired()

    return token
  }
}
