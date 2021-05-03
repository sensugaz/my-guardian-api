import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { LoginCommand } from '../command'
import { EntityManager } from 'typeorm'
import { UserModel } from '@my-guardian-api/database'
import * as bcrypt from 'bcrypt'
import { ApiException } from '@my-guardian-api/common'
import { HttpStatus } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly entityManager: EntityManager,
              private readonly jwtService: JwtService) {
  }

  async execute({ body }: LoginCommand): Promise<{ accessToken: string }> {
    const user = await this.entityManager.findOne(UserModel, {
      email: body.email,
      isActivate: true
    })

    const compare = await bcrypt.compareSync(body.password, user?.password || '')

    if (!compare) {
      throw new ApiException({
        type: 'application',
        module: 'user',
        codes: ['invalid_email_or_password'],
        statusCode: HttpStatus.BAD_REQUEST
      })
    }

    console.log(user)

    const accessToken = await this.jwtService.sign({
      id: user.id,
      role: {
        key: user.role.key,
        value: user.role.value
      }
    })

    return { accessToken }
  }
}