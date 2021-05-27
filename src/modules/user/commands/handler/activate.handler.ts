import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ActivateCommand } from '../command'
import { UserModel, UserTokenModel } from '@my-guardian-api/database'
import { EntityManager } from 'typeorm'
import { ApiException, TokenTypeEnum } from '@my-guardian-api/common'

@CommandHandler(ActivateCommand)
export class ActivateHandler implements ICommandHandler<ActivateCommand> {
  constructor(private readonly entityManager: EntityManager) {}

  async execute({ query }: ActivateCommand): Promise<UserModel> {
    const token = await this.entityManager.findOne(
      UserTokenModel,
      {
        token: query.token,
        type: TokenTypeEnum.REGISTER,
      },
      {
        relations: ['user'],
      },
    )

    if (!token) {
      throw new ApiException({
        module: 'user',
        type: 'application',
        codes: ['token_not_found'],
        statusCode: 400,
      })
    }

    if (!token.user) {
      throw new ApiException({
        module: 'user',
        type: 'application',
        codes: ['user_not_found'],
        statusCode: 400,
      })
    }

    token.usedToken()
    token.user.activate()

    await this.entityManager.save(UserTokenModel, token)
    await this.entityManager.save(UserModel, token.user)

    delete token.user.password
    delete token.user.salt
    delete token.user.tokens

    return token.user
  }
}
